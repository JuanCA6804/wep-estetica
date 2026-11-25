import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminDataService } from '../core/admin-data.service';
import { AuthService } from '../core/auth.service';
import { ProductosService } from '../core/productos.service';

@Component({
  selector: 'app-usuario-panel',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './usuario-panel.component.html',
  styleUrl: './usuario-panel.component.scss'
})
export class UsuarioPanelComponent {
  readonly auth = inject(AuthService);
  private readonly adminData = inject(AdminDataService);
  private readonly productosService = inject(ProductosService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly feedback = signal('');
  readonly serviciosDisponibles = computed(() => {
    const lista = this.productosService.serviciosYPaquetes().map((s) => s.title);
    return lista.length > 0
      ? lista
      : [
          'Corte de cabello para dama',
          'Corte en capas y estilizado',
          'Tintes y luces (Balayage)',
          'Corte clásico para caballero',
          'Arreglo de Uñas Francesas',
          'Paquete Novia Radiante'
        ];
  });

  readonly citaForm = this.fb.nonNullable.group({
    servicio: ['Corte unisex', [Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    fecha: ['', [Validators.required]],
    hora: ['', [Validators.required]]
  });

  readonly misCitas = computed(() => {
    const user = this.auth.user();
    if (!user) return [];
    return this.adminData
      .citas()
      .filter(
        (c) =>
          c.modificadoPor.toLowerCase() === user.nombre_usuario.toLowerCase() ||
          c.nombre_invitado.toLowerCase() === user.nombre_usuario.toLowerCase()
      );
  });

  solicitarCita(): void {
    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      return;
    }
    const user = this.auth.user();
    if (!user) return;

    const val = this.citaForm.getRawValue();
    this.adminData.crearCita({
      nombre_invitado: user.nombre_usuario,
      id_cliente: user.id_usuario,
      telefono: val.telefono,
      servicio: val.servicio,
      fecha: val.fecha,
      hora: val.hora,
      estado: 'PENDIENTE'
    });

    this.citaForm.reset({ servicio: 'Corte unisex', telefono: '', fecha: '', hora: '' });
    this.feedback.set('Tu cita fue registrada con estado PENDIENTE.');
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
