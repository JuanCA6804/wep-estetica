import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDataService } from '../../core/admin-data.service';
import { ProductosService } from '../../core/productos.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  readonly adminData = inject(AdminDataService);
  readonly productosService = inject(ProductosService);

  readonly citasRecientes = computed(() => this.adminData.citas().slice(0, 5));
  readonly citasPendientes = computed(
    () => this.adminData.citas().filter((c) => c.estado === 'PENDIENTE').length
  );

  ngOnInit(): void {
    this.productosService.cargarProductos().subscribe({ error: () => {} });
  }
}
