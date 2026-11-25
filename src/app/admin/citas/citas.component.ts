import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminDataService } from '../../core/admin-data.service';
import { Cita, EstadoCita } from '../../core/models';
import { ProductosService } from '../../core/productos.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';
import { PaginacionComponent } from '../../shared/paginacion.component';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [DatePipe, FormsModule, ReactiveFormsModule, PaginacionComponent, ConfirmModalComponent],
  templateUrl: './citas.component.html',
  styleUrl: '../admin-crud.scss'
})
export class CitasComponent implements OnInit {
  readonly adminData = inject(AdminDataService);
  readonly productosService = inject(ProductosService);
  private readonly fb = inject(FormBuilder);

  readonly estados: EstadoCita[] = ['PENDIENTE', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA'];
  readonly servicios = computed(() => {
    const nombres = this.productosService.serviciosYPaquetes().map((s) => s.title);
    return nombres.length > 0
      ? nombres
      : [
          'Corte de cabello para dama',
          'Corte en capas y estilizado',
          'Tintes y luces (Balayage)',
          'Corte clásico para caballero',
          'Arreglo de Uñas Francesas',
          'Paquete Novia Radiante'
        ];
  });

  readonly pageSize = 5;
  readonly currentPage = signal(1);
  readonly terminoBusqueda = signal('');
  readonly estadoFiltro = signal('todos');

  readonly formAbierto = signal(false);
  readonly editandoId = signal<number | null>(null);
  readonly detalleCita = signal<Cita | null>(null);
  readonly citaAEliminar = signal<Cita | null>(null);
  readonly feedback = signal<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  readonly citaForm = this.fb.nonNullable.group({
    nombre_invitado: ['', [Validators.required, Validators.minLength(3)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    servicio: ['Corte unisex', [Validators.required]],
    fecha: ['', [Validators.required]],
    hora: ['', [Validators.required]],
    estado: ['PENDIENTE' as EstadoCita, [Validators.required]]
  });

  readonly filtradas = computed(() => {
    const term = this.terminoBusqueda().trim().toLowerCase();
    const est = this.estadoFiltro();
    return this.adminData.citas().filter((c) => {
      const matchEst = est === 'todos' || c.estado === est;
      const matchTerm =
        !term ||
        c.nombre_invitado.toLowerCase().includes(term) ||
        (c.servicio && c.servicio.toLowerCase().includes(term)) ||
        (c.id_cliente && String(c.id_cliente).includes(term)) ||
        c.estado.toLowerCase().includes(term);
      return matchEst && matchTerm;
    });
  });

  readonly paginadas = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtradas().slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    this.adminData.recargarCitas();
  }

  onBuscar(valor: string): void {
    this.terminoBusqueda.set(valor);
    this.currentPage.set(1);
  }

  onFiltroEstado(estado: string): void {
    this.estadoFiltro.set(estado);
    this.currentPage.set(1);
  }

  abrirNueva(): void {
    this.editandoId.set(null);
    this.citaForm.reset({
      nombre_invitado: '',
      telefono: '',
      servicio: 'Corte unisex',
      fecha: '',
      hora: '',
      estado: 'PENDIENTE'
    });
    this.formAbierto.set(true);
    this.detalleCita.set(null);
    this.feedback.set(null);
  }

  abrirEditar(cita: Cita): void {
    this.editandoId.set(cita.id_cita);
    this.citaForm.patchValue({
      nombre_invitado: cita.nombre_invitado,
      telefono: cita.telefono ?? '2710000000',
      servicio: cita.servicio ?? 'Corte unisex',
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado
    });
    this.formAbierto.set(true);
    this.detalleCita.set(null);
    this.feedback.set(null);
  }

  cancelarForm(): void {
    this.formAbierto.set(false);
    this.editandoId.set(null);
  }

  guardar(): void {
    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      return;
    }

    const val = this.citaForm.getRawValue();
    const id = this.editandoId();
    if (id === null) {
      const nueva = this.adminData.crearCita(val);
      this.feedback.set({
        tipo: 'success',
        texto: `Cita #${nueva.id_cita} para "${nueva.nombre_invitado}" registrada correctamente.`
      });
    } else {
      this.adminData.actualizarCita(id, val);
      this.feedback.set({
        tipo: 'success',
        texto: `Cita #${id} de "${val.nombre_invitado}" actualizada correctamente.`
      });
    }

    this.formAbierto.set(false);
    this.editandoId.set(null);
  }

  verDetalles(cita: Cita): void {
    this.detalleCita.set(cita);
  }

  solicitarEliminar(cita: Cita): void {
    this.citaAEliminar.set(cita);
  }

  confirmarEliminar(): void {
    const cita = this.citaAEliminar();
    if (!cita) return;

    this.adminData.eliminarCita(cita.id_cita);
    if (this.detalleCita()?.id_cita === cita.id_cita) {
      this.detalleCita.set(null);
    }
    this.citaAEliminar.set(null);
    this.currentPage.set(1);
    this.feedback.set({
      tipo: 'success',
      texto: `Cita #${cita.id_cita} de "${cita.nombre_invitado}" eliminada correctamente.`
    });
  }
}
