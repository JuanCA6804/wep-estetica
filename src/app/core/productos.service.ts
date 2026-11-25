import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { fechaBitacoraActual } from './crypto.util';
import { ProductoApi, ProductoInput } from './models';
import {
  INITIAL_CATALOGO,
  STORAGE_CATALOGO_KEY,
  loadOrSeedStorage,
  saveStorage
} from './seed-data';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = 'https://fakestoreapi.com/products';

  /** Catálogo completo (productos, servicios y paquetes) persistido localmente */
  readonly catalogo = signal<ProductoApi[]>(
    loadOrSeedStorage(STORAGE_CATALOGO_KEY, INITIAL_CATALOGO)
  );

  /** Solo los productos para la vista pública /productos */
  readonly soloProductos = computed(() =>
    this.catalogo().filter((item) => item.tipo === 'producto')
  );

  /** Solo los servicios y paquetes para la vista pública /servicios y formularios de citas */
  readonly serviciosYPaquetes = computed(() =>
    this.catalogo().filter((item) => item.tipo === 'servicio' || item.tipo === 'paquete')
  );

  /** Alias compatible con componentes que leen todo el catálogo */
  readonly productos = computed(() => this.catalogo());

  /** Todas las categorías del catálogo */
  readonly categorias = computed(() => {
    const base = [
      'Cuidado Capilar',
      'Cuidado Facial y Spa',
      'Manicure y Uñas',
      'Barbería y Estilizado',
      'Cortes para dama',
      'Cortes para caballero',
      'Uñas y Cuidado Facial',
      'Paquetes para Boda y Spa'
    ];
    const dinamicas = this.catalogo().map((i) => i.category);
    return Array.from(new Set([...base, ...dinamicas]));
  });

  /** Categorías exclusivas de productos */
  readonly categoriasProductos = computed(() => {
    const cats = this.soloProductos().map((p) => p.category);
    return Array.from(new Set(cats));
  });

  /** Categorías de servicios y paquetes */
  readonly categoriasServiciosYPaquetes = computed(() => {
    const cats = this.serviciosYPaquetes().map((s) => s.category);
    return Array.from(new Set(cats));
  });

  readonly cargando = signal(false);
  readonly error = signal('');

  /** Imágenes locales disponibles en public/assets/images */
  readonly imagenesPredefinidas: { etiqueta: string; ruta: string }[] = [
    { etiqueta: 'Shampoo / Producto Capilar 1', ruta: 'assets/images/producto_1.jpg' },
    { etiqueta: 'Mascarilla / Producto Capilar 2', ruta: 'assets/images/producto_2.jpg' },
    { etiqueta: 'Corte y Cabello Dama', ruta: 'assets/images/cabello_ref1.png' },
    { etiqueta: 'Peinado / Novia / Balayage', ruta: 'assets/images/peinado_1.jpg' },
    { etiqueta: 'Manicure / Uñas Francesas', ruta: 'assets/images/unas_1.jpg' },
    { etiqueta: 'Pedicure Spa / Gelish', ruta: 'assets/images/unas_2.jpg' },
    { etiqueta: 'Corte Clásico Caballero', ruta: 'assets/images/servicios_hero.png' },
    { etiqueta: 'Corte Fade / Degradado', ruta: 'assets/images/servicios_ref4.png' },
    { etiqueta: 'Spa / Facial / Ritual de Barba', ruta: 'assets/images/inicio_hero.jpg' }
  ];

  private buildHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private currentActor(): string {
    return this.authService.currentUserValue?.nombre_usuario ?? 'admin_kenya';
  }

  private persistir(items: ProductoApi[]): void {
    this.catalogo.set(items);
    saveStorage(STORAGE_CATALOGO_KEY, items);
  }

  cargarProductos(forceRefresh = false): Observable<ProductoApi[]> {
    const guardados = loadOrSeedStorage(STORAGE_CATALOGO_KEY, INITIAL_CATALOGO);
    this.catalogo.set(guardados);

    if (!forceRefresh) {
      return of(guardados);
    }

    this.cargando.set(true);
    this.error.set('');

    // Realiza petición GET de sincronización 
    return this.http.get<unknown[]>(this.apiUrl, { headers: this.buildHeaders() }).pipe(
      map(() => this.catalogo()),
      tap(() => {
        this.cargando.set(false);
      }),
      catchError(() => {
        this.cargando.set(false);
        return of(this.catalogo());
      })
    );
  }

  cargarCategorias(): Observable<string[]> {
    return of(this.categorias());
  }

  restaurarCatalogoInicial(): void {
    this.persistir([...INITIAL_CATALOGO]);
  }

  crearProducto(input: ProductoInput): Observable<ProductoApi> {
    const actual = this.catalogo();
    const nextId = actual.reduce((max, item) => Math.max(max, item.id), 0) + 1;

    const nuevo: ProductoApi = {
      ...input,
      id: nextId,
      price: Number(input.price),
      rating: { rate: 5.0, count: 1 },
      fechaModificacion: fechaBitacoraActual(),
      modificadoPor: this.currentActor()
    };

    // Guardamos inmediatamente en localStorage
    this.persistir([nuevo, ...actual]);

    const payloadApi = {
      title: input.title,
      price: Number(input.price),
      description: input.description,
      category: input.category,
      image: input.image
    };

    return this.http
      .post<Partial<ProductoApi>>(this.apiUrl, payloadApi, { headers: this.buildHeaders() })
      .pipe(
        catchError(() => of(nuevo)),
        map(() => nuevo)
      );
  }

  actualizarProducto(id: number, input: ProductoInput): Observable<ProductoApi> {
    const actual = this.catalogo();
    const existente = actual.find((i) => i.id === id);

    const actualizado: ProductoApi = {
      ...(existente ?? { id, rating: { rate: 5.0, count: 1 } }),
      ...input,
      id,
      price: Number(input.price),
      fechaModificacion: fechaBitacoraActual(),
      modificadoPor: this.currentActor()
    };

    // Guardamos inmediatamente en localStorage 
    const nuevaLista = actual.map((item) => (item.id === id ? actualizado : item));
    this.persistir(nuevaLista);

    const payloadApi = {
      title: input.title,
      price: Number(input.price),
      description: input.description,
      category: input.category,
      image: input.image
    };

    return this.http
      .put<Partial<ProductoApi>>(`${this.apiUrl}/${id}`, payloadApi, {
        headers: this.buildHeaders()
      })
      .pipe(
        catchError(() => of(actualizado)),
        map(() => actualizado)
      );
  }

  eliminarProducto(id: number): Observable<void> {
    const nuevaLista = this.catalogo().filter((item) => item.id !== id);
    this.persistir(nuevaLista);

    return this.http
      .delete<unknown>(`${this.apiUrl}/${id}`, { headers: this.buildHeaders() })
      .pipe(
        catchError(() => of(null)),
        map(() => void 0)
      );
  }
}
