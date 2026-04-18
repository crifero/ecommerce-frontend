import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>Iniciar Sesión</h1>
        <form (ngSubmit)="submit()" #f="ngForm">
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
            {{ loading() ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
        <p class="auth-link">¿No tienes cuenta? <a routerLink="/auth/register">Regístrate</a></p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  submit(): void {
    this.loading.set(true);
    this.error.set('');
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Credenciales inválidas');
        this.loading.set(false);
      },
    });
  }
}
