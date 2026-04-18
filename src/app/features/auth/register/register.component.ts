import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>Crear Cuenta</h1>
        <form (ngSubmit)="submit()" #f="ngForm">
          <div class="field">
            <label>Nombre</label>
            <input type="text" name="name" [(ngModel)]="name" required />
          </div>
          <div class="field">
            <label>Correo electrónico</label>
            <input type="email" name="email" [(ngModel)]="email" required />
          </div>
          <div class="field">
            <label>Contraseña</label>
            <input type="password" name="password" [(ngModel)]="password" required minlength="6" />
          </div>
          @if (error()) {
            <p class="error">{{ error() }}</p>
          }
          <button class="btn btn--primary" type="submit" [disabled]="loading()">
            {{ loading() ? 'Creando...' : 'Registrarse' }}
          </button>
        </form>
        <p class="auth-link">¿Ya tienes cuenta? <a routerLink="/auth/login">Iniciar Sesión</a></p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  submit(): void {
    this.loading.set(true);
    this.error.set('');
    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al registrarse');
        this.loading.set(false);
      },
    });
  }
}
