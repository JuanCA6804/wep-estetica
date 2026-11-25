import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, from, switchMap, tap, throwError } from 'rxjs';
import { fechaBitacoraActual, sha256Hex } from './crypto.util';
import { RolUsuario, Usuario } from './models';
import { INITIAL_USUARIOS, STORAGE_USERS_KEY, loadOrSeedStorage, saveStorage } from './seed-data';

interface LoginResponse {
  token: string;
}

interface TokenPayload {
  user?: string;
  sub?: number;
}

export interface RegistroPayload {
  nombre_usuario: string;
  correo: string;
  password: string;
}

const STORAGE_TOKEN_KEY = 'estetica_fakestore_token';
const STORAGE_USER_KEY = 'estetica_current_user';

const EXTERNAL_RESERVED_EMAILS = new Set(['kevin@gmail.com']);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly loginUrl = 'https://fakestoreapi.com/auth/login';

  private readonly tokenSignal = signal<string | null>(this.readStorage(STORAGE_TOKEN_KEY));
  private readonly currentUserSignal = signal<Usuario | null>(this.readStoredUser());
  private readonly currentUserSubject = new BehaviorSubject<Usuario | null>(this.currentUserSignal());

  readonly user = this.currentUserSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null && this.tokenSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.rol === 'ADMINISTRADOR');

  get currentUser(): Observable<Usuario | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue(): Usuario | null {
    return this.currentUserSignal();
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  hasAdminAccess(): boolean {
    return this.isAuthenticated() && this.isAdmin();
  }

  /**
   * Authenticates either against locally registered users (SHA-256 verified)
   * or against FakeStoreAPI /auth/login (JWT token decoded for role assignment).
   */
  loginWithCredentials(identificador: string, password: string): Observable<Usuario> {
    const cleanId = identificador.trim();
    return from(sha256Hex(password)).pipe(
      switchMap((hashedPassword) => {
        const users = loadOrSeedStorage(STORAGE_USERS_KEY, INITIAL_USUARIOS);
        const localMatch = users.find(
          (u) =>
            u.passwordHash &&
            (u.nombre_usuario.toLowerCase() === cleanId.toLowerCase() ||
              u.correo.toLowerCase() === cleanId.toLowerCase()) &&
            u.passwordHash === hashedPassword
        );

        if (localMatch) {
          const localJwt = this.buildLocalToken(localMatch.nombre_usuario, localMatch.id_usuario);
          this.persistSession(localJwt, localMatch);
          return from([localMatch]);
        }

        const localAccountWrongPass = users.find(
          (u) =>
            u.passwordHash &&
            (u.nombre_usuario.toLowerCase() === cleanId.toLowerCase() ||
              u.correo.toLowerCase() === cleanId.toLowerCase())
        );
        if (localAccountWrongPass) {
          return throwError(() => ({ status: 401, message: 'Usuario o contraseña incorrecta.' }));
        }

        // Si el usuario ingresó su correo (ej. john@gmail.com o morrison@gmail.com),
        // lo traducimos a su nombre_usuario (johnd / mor_2314) para autenticar contra FakeStoreAPI.
        const matchedAccount = users.find(
          (u) =>
            u.nombre_usuario.toLowerCase() === cleanId.toLowerCase() ||
            u.correo.toLowerCase() === cleanId.toLowerCase()
        );
        const apiUsername = matchedAccount ? matchedAccount.nombre_usuario : cleanId;

        return this.http.post<LoginResponse>(this.loginUrl, { username: apiUsername, password }).pipe(
          switchMap((response) => {
            const usernameFromToken = this.readUsernameFromToken(response.token) ?? apiUsername;
            const knownUser =
              matchedAccount ??
              users.find((u) => u.nombre_usuario.toLowerCase() === usernameFromToken.toLowerCase());
            const rol: RolUsuario =
              knownUser?.rol ?? (usernameFromToken === 'johnd' ? 'ADMINISTRADOR' : 'USUARIO');

            const user: Usuario = {
              id_usuario: knownUser?.id_usuario ?? (usernameFromToken === 'johnd' ? 1 : 2),
              nombre_usuario: knownUser?.nombre_usuario ?? usernameFromToken,
              correo:
                knownUser?.correo ??
                (usernameFromToken === 'johnd' ? 'john@gmail.com' : `${usernameFromToken}@fakestore.com`),
              rol,
              fechaModificacion: fechaBitacoraActual(),
              modificadoPor: knownUser?.nombre_usuario ?? usernameFromToken
            };
            this.persistSession(response.token, user);
            return from([user]);
          })
        );
      })
    );
  }

  /**
   * Registers a new standard user enforcing unique email and SHA-256 password hashing.
   */
  register(payload: RegistroPayload): Observable<Usuario> {
    const nombre = payload.nombre_usuario.trim();
    const correo = payload.correo.trim().toLowerCase();
    const users = loadOrSeedStorage(STORAGE_USERS_KEY, INITIAL_USUARIOS);

    const emailExists =
      EXTERNAL_RESERVED_EMAILS.has(correo) ||
      users.some((u) => u.correo.toLowerCase() === correo);

    if (emailExists) {
      return throwError(() => ({
        status: 409,
        message: 'Este correo electrónico ya está registrado. Usa otro correo o inicia sesión.'
      }));
    }

    const usernameExists = users.some(
      (u) => u.nombre_usuario.toLowerCase() === nombre.toLowerCase()
    );

    if (usernameExists) {
      return throwError(() => ({
        status: 409,
        message: 'Ese nombre de usuario ya existe. Elige uno distinto.'
      }));
    }

    return from(sha256Hex(payload.password)).pipe(
      tap((passwordHash) => {
        const nextId = users.reduce((max, u) => Math.max(max, u.id_usuario), 10) + 1;
        const nuevo: Usuario = {
          id_usuario: nextId,
          nombre_usuario: nombre,
          correo,
          rol: 'USUARIO',
          passwordHash,
          fechaModificacion: fechaBitacoraActual(),
          modificadoPor: nombre
        };
        saveStorage(STORAGE_USERS_KEY, [nuevo, ...users]);
        const token = this.buildLocalToken(nuevo.nombre_usuario, nuevo.id_usuario);
        this.persistSession(token, nuevo);
      }),
      switchMap(() => {
        const user = this.currentUserSignal();
        return from(user ? [user] : []);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.currentUserSubject.next(null);
  }

  private persistSession(token: string, user: Usuario): void {
    const safeUser: Usuario = { ...user };
    delete safeUser.passwordHash;
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(safeUser));
    this.tokenSignal.set(token);
    this.currentUserSignal.set(safeUser);
    this.currentUserSubject.next(safeUser);
  }

  private readStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private readStoredUser(): Usuario | null {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }

  private readUsernameFromToken(token: string): string | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const data = JSON.parse(atob(padded)) as TokenPayload;
      return data.user ?? null;
    } catch {
      return null;
    }
  }

  private buildLocalToken(username: string, sub: number): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub, user: username, iat: Math.floor(Date.now() / 1000) }));
    return `${header}.${payload}.local_session`;
  }
}
