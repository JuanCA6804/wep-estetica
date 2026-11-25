import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoApi, TipoCatalogo } from '../../core/models';
import { ProductosService } from '../../core/productos.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';
import { PaginacionComponent } from '../../shared/paginacion.component';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    PaginacionComponent,
    ConfirmModalComponent
  ],
  templateUrl: './admin-productos.component.html',
  styleUrl: '../admin-crud.scss'
})
export class AdminProductosComponent implements OnInit {
  readonly productosService = inject(ProductosService);
  private readonly fb = inject(FormBuilder);

  readonly pageSize = 6;
  readonly currentPage = signal(1);
  readonly terminoBusqueda = signal('');
  readonly tipoFiltro = signal<'todos' | TipoCatalogo>('todos');
  readonly categoriaFiltro = signal('todas');

  readonly formAbierto = signal(false);
  readonly editandoId = signal<number | null>(null);
  readonly guardando = signal(false);

  readonly feedback = signal<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  readonly productoAEliminar = signal<ProductoApi | null>(null);
  readonly eliminando = signal(false);

  readonly productoForm = this.fb.nonNullable.group({
    tipo: ['producto' as TipoCatalogo, [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: [150, [Validators.required, Validators.min(1)]],
    category: ['Cuidado Capilar', [Validators.required]],
    duracion: ['Envase 500 ml', [Validators.required, Validators.minLength(2)]],
    image: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  readonly filtrados = computed(() => {
    const term = this.terminoBusqueda().trim().toLowerCase();
    const tipo = this.tipoFiltro();
    const cat = this.categoriaFiltro();

    return this.productosService.catalogo().filter((p) => {
      const matchTipo = tipo === 'todos' || p.tipo === tipo;
      const matchCat = cat === 'todas' || p.category === cat;
      const matchTerm =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.tipo.toLowerCase().includes(term) ||
        String(p.id).includes(term);
      return matchTipo && matchCat && matchTerm;
    });
  });

  readonly paginados = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtrados().slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    this.productosService.cargarCategorias().subscribe();
    this.productosService.cargarProductos().subscribe({ error: () => {} });
  }

  onBuscar(valor: string): void {
    this.terminoBusqueda.set(valor);
    this.currentPage.set(1);
  }

  onFiltroTipo(tipo: 'todos' | TipoCatalogo): void {
    this.tipoFiltro.set(tipo);
    this.currentPage.set(1);
  }

  onFiltroCategoria(cat: string): void {
    this.categoriaFiltro.set(cat);
    this.currentPage.set(1);
  }

  etiquetaTipo(tipo: TipoCatalogo): string {
    if (tipo === 'servicio') return 'Servicio';
    if (tipo === 'paquete') return 'Paquete';
    return 'Producto';
  }

  alCambiarTipoForm(): void {
    const tipo = this.productoForm.controls.tipo.value;
    if (tipo === 'producto') {
      this.productoForm.patchValue({
        category: 'Cuidado Capilar',
        duracion: 'Envase 500 ml'
      });
    } else if (tipo === 'paquete') {
      this.productoForm.patchValue({
        category: 'Paquetes para Boda y Spa',
        duracion: '3 hrs'
      });
    } else {
      this.productoForm.patchValue({
        category: 'Cortes para dama',
        duracion: '45 min'
      });
    }
  }

  abrirNuevo(tipoInicial: TipoCatalogo = 'producto'): void {
    this.editandoId.set(null);

    const defaultCategory =
      tipoInicial === 'producto'
        ? 'Cuidado Capilar'
        : tipoInicial === 'paquete'
          ? 'Paquetes para Boda y Spa'
          : 'Cortes para dama';

    const defaultDuracion =
      tipoInicial === 'producto'
        ? 'Envase 500 ml'
        : tipoInicial === 'paquete'
          ? '3 hrs'
          : '45 min';

    this.productoForm.reset({
      tipo: tipoInicial,
      title: '',
      price: 150,
      category: defaultCategory,
      duracion: defaultDuracion,
      image: '',
      description: ''
    });
    this.formAbierto.set(true);
    this.feedback.set(null);
  }

  abrirEditar(prod: ProductoApi): void {
    this.editandoId.set(prod.id);
    this.productoForm.patchValue({
      tipo: prod.tipo ?? 'producto',
      title: prod.title,
      price: prod.price,
      category: prod.category,
      duracion: prod.duracion ?? (prod.tipo === 'producto' ? 'Envase 250 ml' : '45 min'),
      image: prod.image,
      description: prod.description
    });
    this.formAbierto.set(true);
    this.feedback.set(null);
  }

  cancelarForm(): void {
    this.formAbierto.set(false);
    this.editandoId.set(null);
  }

  guardar(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.feedback.set(null);
    const payload = this.productoForm.getRawValue();
    const id = this.editandoId();

    const request$ =
      id === null
        ? this.productosService.crearProducto(payload)
        : this.productosService.actualizarProducto(id, payload);

    request$.subscribe({
      next: (res) => {
        this.guardando.set(false);
        this.formAbierto.set(false);
        this.editandoId.set(null);
        const etiqueta = this.etiquetaTipo(res.tipo);
        this.feedback.set({
          tipo: 'success',
          texto:
            id === null
              ? `${etiqueta} "${res.title}" agregado correctamente (ID #${res.id}).`
              : `${etiqueta} #${id} ("${res.title}") actualizado.`
        });
      },
      error: () => {
        this.guardando.set(false);
        this.feedback.set({
          tipo: 'error',
          texto: 'No se pudo guardar el registro. Verifica los datos e intenta nuevamente.'
        });
      }
    });
  }

  solicitarEliminar(prod: ProductoApi): void {
    this.productoAEliminar.set(prod);
  }

  confirmarEliminar(): void {
    const prod = this.productoAEliminar();
    if (!prod) return;

    this.eliminando.set(true);
    this.productosService.eliminarProducto(prod.id).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.productoAEliminar.set(null);
        this.currentPage.set(1);
        this.feedback.set({
          tipo: 'success',
          texto: `${this.etiquetaTipo(prod.tipo)} "${prod.title}" eliminado.`
        });
      },
      error: () => {
        this.eliminando.set(false);
        this.productoAEliminar.set(null);
        this.feedback.set({
          tipo: 'error',
          texto: 'No se pudo eliminar el registro.'
        });
      }
    });
  }
}
