import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal('');

  readonly loginForm = this.fb.nonNullable.group({
    nombre_usuario: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { nombre_usuario, password } = this.loginForm.getRawValue();
    this.authService.loginWithCredentials(nombre_usuario, password).subscribe({
      next: (user) => {
        this.loading.set(false);
        if (user.rol === 'ADMINISTRADOR') {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/usuario');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.status === 401
            ? 'Usuario o contraseña incorrecta.'
            : err?.message || 'No se pudo conectar con el servidor de autenticación. Intenta más tarde.'
        );
      }
    });
  }
}
