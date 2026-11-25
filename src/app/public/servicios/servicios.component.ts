import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoApi } from '../../core/models';
import { ProductosService } from '../../core/productos.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  readonly productosService = inject(ProductosService);
  private readonly router = inject(Router);

  readonly activeTab = signal<string>('Todos');

  readonly pestanasCategorias = computed(() => {
    const cats = this.productosService.categoriasServiciosYPaquetes();
    return ['Todos', ...cats];
  });

  readonly itemsVisibles = computed(() => {
    const tab = this.activeTab();
    const todos = this.productosService.serviciosYPaquetes();
    if (tab === 'Todos') {
      return todos;
    }
    return todos.filter((item) => item.category === tab);
  });

  ngOnInit(): void {
    this.productosService.cargarProductos().subscribe({ error: () => {} });
  }

  seleccionarTab(tab: string): void {
    this.activeTab.set(tab);
  }

  goToProductos(): void {
    this.router.navigate(['/productos']);
  }

  agendarCita(item?: ProductoApi): void {
    if (item) {
      this.router.navigate(['/contacto'], {
        queryParams: {
          tipo: item.tipo,
          item: item.title,
          precio: item.price,
          presentacion: item.duracion
        }
      });
      return;
    }
    this.router.navigate(['/contacto']);
  }
}
