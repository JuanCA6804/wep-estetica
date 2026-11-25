import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminDataService } from '../../core/admin-data.service';
import { AuthService } from '../../core/auth.service';
import { RolUsuario, Usuario } from '../../core/models';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';
import { PaginacionComponent } from '../../shared/paginacion.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, PaginacionComponent, ConfirmModalComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: '../admin-crud.scss'
})
export class UsuariosComponent implements OnInit {
  readonly adminData = inject(AdminDataService);
  readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly rolesDisponibles: RolUsuario[] = ['ADMINISTRADOR', 'RECEPCIONISTA', 'ESTILISTA', 'USUARIO'];
  readonly pageSize = 5;
  readonly currentPage = signal(1);
  readonly terminoBusqueda = signal('');
  readonly rolFiltro = signal('todos');

  readonly formAbierto = signal(false);
  readonly editandoId = signal<number | null>(null);
  readonly guardando = signal(false);

  readonly feedback = signal<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  readonly usuarioAEliminar = signal<Usuario | null>(null);

  readonly usuarioForm = this.fb.nonNullable.group({
    nombre_usuario: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    rol: ['USUARIO' as RolUsuario, [Validators.required]],
    password: ['']
  });

  readonly filtrados = computed(() => {
    const term = this.terminoBusqueda().trim().toLowerCase();
    const rol = this.rolFiltro();
    return this.adminData.usuarios().filter((u) => {
      const matchRol = rol === 'todos' || u.rol === rol;
      const matchTerm =
        !term ||
        u.nombre_usuario.toLowerCase().includes(term) ||
        u.correo.toLowerCase().includes(term) ||
        u.rol.toLowerCase().includes(term);
      return matchRol && matchTerm;
    });
  });

  readonly paginados = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtrados().slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    this.adminData.recargarUsuarios();
  }

  onBuscar(valor: string): void {
    this.terminoBusqueda.set(valor);
    this.currentPage.set(1);
  }

  onFiltroRol(rol: string): void {
    this.rolFiltro.set(rol);
    this.currentPage.set(1);
  }

  abrirNuevo(): void {
    this.editandoId.set(null);
    this.usuarioForm.reset({ nombre_usuario: '', correo: '', rol: 'USUARIO', password: '' });
    this.usuarioForm.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    this.usuarioForm.controls.password.updateValueAndValidity();
    this.formAbierto.set(true);
    this.feedback.set(null);
  }

  abrirEditar(user: Usuario): void {
    this.editandoId.set(user.id_usuario);
    this.usuarioForm.patchValue({
      nombre_usuario: user.nombre_usuario,
      correo: user.correo,
      rol: user.rol,
      password: ''
    });
    this.usuarioForm.controls.password.setValidators([Validators.minLength(6)]);
    this.usuarioForm.controls.password.updateValueAndValidity();
    this.formAbierto.set(true);
    this.feedback.set(null);
  }

  cancelarForm(): void {
    this.formAbierto.set(false);
    this.editandoId.set(null);
    this.usuarioForm.reset({ nombre_usuario: '', correo: '', rol: 'USUARIO', password: '' });
  }

  async guardar(): Promise<void> {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const val = this.usuarioForm.getRawValue();
    const id = this.editandoId();
    const res =
      id === null
        ? await this.adminData.crearUsuario({
            nombre_usuario: val.nombre_usuario,
            correo: val.correo,
            rol: val.rol,
            password: val.password
          })
        : await this.adminData.actualizarUsuario(id, {
            nombre_usuario: val.nombre_usuario,
            correo: val.correo,
            rol: val.rol,
            password: val.password || undefined
          });

    this.guardando.set(false);
    if (!res.ok) {
      this.feedback.set({ tipo: 'error', texto: res.error || 'No se pudo guardar el usuario.' });
      return;
    }

    this.formAbierto.set(false);
    this.editandoId.set(null);
    this.feedback.set({
      tipo: 'success',
      texto:
        id === null
          ? `Usuario "${res.usuario?.nombre_usuario}" creado correctamente (contraseña protegida con SHA-256).`
          : `Usuario "${res.usuario?.nombre_usuario}" actualizado correctamente.`
    });
  }

  solicitarEliminar(user: Usuario): void {
    this.usuarioAEliminar.set(user);
  }

  confirmarEliminar(): void {
    const target = this.usuarioAEliminar();
    if (!target) return;

    this.adminData.eliminarUsuario(target.id_usuario);
    this.usuarioAEliminar.set(null);
    this.currentPage.set(1);
    this.feedback.set({
      tipo: 'success',
      texto: `Usuario "${target.nombre_usuario}" eliminado correctamente.`
    });
  }

  esUsuarioActual(user: Usuario): boolean {
    const active = this.auth.user();
    return active?.nombre_usuario.toLowerCase() === user.nombre_usuario.toLowerCase();
  }
}
