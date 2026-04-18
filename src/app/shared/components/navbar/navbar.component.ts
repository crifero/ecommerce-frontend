import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  template: `
    <nav class="navbar">
      <div class="navbar__brand">🛒 Ecommerce</div>
      <div class="navbar__links">
        <a routerLink="/products" routerLinkActive="active">Productos</a>
        <a routerLink="/orders" routerLinkActive="active">Mis Pedidos</a>
      </div>
      <div class="navbar__user">
        <span class="badge" [class.badge--admin]="auth.isAdmin()">
          {{ auth.user()?.role | uppercase }}
        </span>
        <span class="navbar__name">{{ auth.user()?.name }}</span>
        <button class="btn btn--ghost" (click)="auth.logout()">Cerrar Sesión</button>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
}
