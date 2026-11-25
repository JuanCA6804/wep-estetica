import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { fechaBitacoraActual, sha256Hex } from './crypto.util';
import { Cita, EstadoCita, RolUsuario, Usuario } from './models';
import {
  INITIAL_CITAS,
  INITIAL_USUARIOS,
  STORAGE_CITAS_KEY,
  STORAGE_USERS_KEY,
  loadOrSeedStorage,
  saveStorage
} from './seed-data';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private readonly authService = inject(AuthService);

  readonly usuarios = signal<Usuario[]>(loadOrSeedStorage(STORAGE_USERS_KEY, INITIAL_USUARIOS));
  readonly citas = signal<Cita[]>(loadOrSeedStorage(STORAGE_CITAS_KEY, INITIAL_CITAS));

  recargarUsuarios(): void {
    this.usuarios.set(loadOrSeedStorage(STORAGE_USERS_KEY, INITIAL_USUARIOS));
  }

  recargarCitas(): void {
    this.citas.set(loadOrSeedStorage(STORAGE_CITAS_KEY, INITIAL_CITAS));
  }

  private actor(): string {
    return this.authService.currentUserValue?.nombre_usuario ?? 'sistema';
  }

  async crearUsuario(data: {
    nombre_usuario: string;
    correo: string;
    rol: RolUsuario;
    password?: string;
  }): Promise<{ ok: boolean; error?: string; usuario?: Usuario }> {
    const correoNorm = data.correo.trim().toLowerCase();
    const userNorm = data.nombre_usuario.trim();
    const lista = loadOrSeedStorage(STORAGE_USERS_KEY, INITIAL_USUARIOS);

    if (lista.some((u) => u.correo.toLowerCase() === correoNorm)) {
      return { ok: false, error: 'El correo electrónico ya está registrado en otro usuario.' };
    }
    if (lista.some((u) => u.nombre_usuario.toLowerCase() === userNorm.toLowerCase())) {
      return { ok: false, error: 'El nombre de usuario ya existe.' };
    }

    const nextId = lista.reduce((max, u) => Math.max(max, u.id_usuario), 0) + 1;
    const passwordHash = data.password ? await sha256Hex(data.password) : undefined;

    const nuevo: Usuario = {
      id_usuario: nextId,
      nombre_usuario: userNorm,
      correo: correoNorm,
      rol: data.rol,
      passwordHash,
      fechaModificacion: fechaBitacoraActual(),
      modificadoPor: this.actor()
    };

    const updated = [nuevo, ...lista];
    this.usuarios.set(updated);
    saveStorage(STORAGE_USERS_KEY, updated);
    return { ok: true, usuario: nuevo };
  }

  async actualizarUsuario(
    id: number,
    data: { nombre_usuario: string; correo: string; rol: RolUsuario; password?: string }
  ): Promise<{ ok: boolean; error?: string; usuario?: Usuario }> {
    const correoNorm = data.correo.trim().toLowerCase();
    const userNorm = data.nombre_usuario.trim();
    const lista = loadOrSeedStorage(STORAGE_USERS_KEY, INITIAL_USUARIOS);

    if (lista.some((u) => u.id_usuario !== id && u.correo.toLowerCase() === correoNorm)) {
      return { ok: false, error: 'Otro usuario ya utiliza ese correo electrónico.' };
    }
    if (lista.some((u) => u.id_usuario !== id && u.nombre_usuario.toLowerCase() === userNorm.toLowerCase())) {
      return { ok: false, error: 'Otro usuario ya utiliza ese nombre de usuario.' };
    }

    const passwordHash = data.password ? await sha256Hex(data.password) : undefined;
    let updatedUser: Usuario | undefined;

    const updated = lista.map((u) => {
      if (u.id_usuario !== id) return u;
      updatedUser = {
        ...u,
        nombre_usuario: userNorm,
        correo: correoNorm,
        rol: data.rol,
        passwordHash: passwordHash ?? u.passwordHash,
        fechaModificacion: fechaBitacoraActual(),
        modificadoPor: this.actor()
      };
      return updatedUser;
    });

    this.usuarios.set(updated);
    saveStorage(STORAGE_USERS_KEY, updated);
    return { ok: true, usuario: updatedUser };
  }

  eliminarUsuario(id: number): void {
    const lista = loadOrSeedStorage(STORAGE_USERS_KEY, INITIAL_USUARIOS);
    const updated = lista.filter((u) => u.id_usuario !== id);
    this.usuarios.set(updated);
    saveStorage(STORAGE_USERS_KEY, updated);
  }

  crearCita(data: {
    nombre_invitado: string;
    telefono: string;
    servicio: string;
    fecha: string;
    hora: string;
    estado: EstadoCita;
    id_cliente?: number;
  }): Cita {
    const lista = loadOrSeedStorage(STORAGE_CITAS_KEY, INITIAL_CITAS);
    const nextId = lista.reduce((max, c) => Math.max(max, c.id_cita), 100) + 1;
    const nueva: Cita = {
      id_cita: nextId,
      id_cliente: data.id_cliente,
      nombre_invitado: data.nombre_invitado.trim(),
      telefono: data.telefono.trim(),
      servicio: data.servicio.trim(),
      fecha: data.fecha,
      hora: data.hora,
      estado: data.estado,
      fechaModificacion: fechaBitacoraActual(),
      modificadoPor: this.actor()
    };

    const updated = [nueva, ...lista];
    this.citas.set(updated);
    saveStorage(STORAGE_CITAS_KEY, updated);
    return nueva;
  }

  actualizarCita(
    id: number,
    data: {
      nombre_invitado: string;
      telefono: string;
      servicio: string;
      fecha: string;
      hora: string;
      estado: EstadoCita;
    }
  ): Cita | undefined {
    const lista = loadOrSeedStorage(STORAGE_CITAS_KEY, INITIAL_CITAS);
    let edited: Cita | undefined;
    const updated = lista.map((c) => {
      if (c.id_cita !== id) return c;
      edited = {
        ...c,
        nombre_invitado: data.nombre_invitado.trim(),
        telefono: data.telefono.trim(),
        servicio: data.servicio.trim(),
        fecha: data.fecha,
        hora: data.hora,
        estado: data.estado,
        fechaModificacion: fechaBitacoraActual(),
        modificadoPor: this.actor()
      };
      return edited;
    });

    this.citas.set(updated);
    saveStorage(STORAGE_CITAS_KEY, updated);
    return edited;
  }

  eliminarCita(id: number): void {
    const lista = loadOrSeedStorage(STORAGE_CITAS_KEY, INITIAL_CITAS);
    const updated = lista.filter((c) => c.id_cita !== id);
    this.citas.set(updated);
    saveStorage(STORAGE_CITAS_KEY, updated);
  }
}
