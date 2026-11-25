import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoApi } from '../../core/models';
import { ProductosService } from '../../core/productos.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  readonly productosService = inject(ProductosService);
  private readonly router = inject(Router);

  readonly categoriaActiva = signal<string>('todas');
  readonly busqueda = signal<string>('');

  readonly productosFiltrados = computed(() => {
    const cat = this.categoriaActiva();
    const term = this.busqueda().trim().toLowerCase();
    return this.productosService.soloProductos().filter((p) => {
      const matchCat = cat === 'todas' || p.category === cat;
      const matchTerm =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (p.duracion && p.duracion.toLowerCase().includes(term));
      return matchCat && matchTerm;
    });
  });

  ngOnInit(): void {
    this.productosService.cargarCategorias().subscribe();
    this.cargar();
  }

  cargar(force = false): void {
    this.productosService.cargarProductos(force).subscribe({
      error: () => {}
    });
  }

  seleccionarCategoria(cat: string): void {
    this.categoriaActiva.set(cat);
  }

  solicitarEnContacto(producto: ProductoApi): void {
    this.router.navigate(['/contacto'], {
      queryParams: {
        tipo: 'producto',
        item: producto.title,
        precio: producto.price,
        presentacion: producto.duracion
      }
    });
  }
}
