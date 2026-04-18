import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, PaginatedResponse } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyPipe],
  template: `
    <div class="page">
      <div class="page__header">
        <h2>Productos</h2>
        <div class="page__actions">
          <input class="input--search" placeholder="Buscar por nombre..." [(ngModel)]="search" (input)="onSearch()" />
          @if (auth.isAdmin()) {
            <a class="btn btn--primary" routerLink="/products/new">+ Nuevo Producto</a>
          }
        </div>
      </div>

      @if (loading()) {
        <p class="state-msg">Cargando...</p>
      } @else if (products().length === 0) {
        <p class="state-msg">No se encontraron productos.</p>
      } @else {
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                @if (auth.isAdmin()) { <th>Acciones</th> }
              </tr>
            </thead>
            <tbody>
              @for (p of products(); track p.id) {
                <tr>
                  <td>{{ p.id }}</td>
                  <td>{{ p.name }}</td>
                  <td>{{ p.price | currency }}</td>
                  <td>{{ p.stock }}</td>
                  <td>
                    <span class="badge" [class.badge--active]="p.isActive" [class.badge--inactive]="!p.isActive">
                      {{ p.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  @if (auth.isAdmin()) {
                    <td class="actions">
                      <a class="btn btn--sm" [routerLink]="['/products', p.id, 'edit']">Editar</a>
                      <button class="btn btn--sm btn--danger" (click)="remove(p)">Eliminar</button>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  private productSvc = inject(ProductService);
  auth = inject(AuthService);

  products = signal<Product[]>([]);
  loading = signal(true);
  search = '';
  private searchTimer: any;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    const params = this.search ? { name: this.search } : {};
    this.productSvc.findAll(params).subscribe({
      next: res => {
        this.products.set(Array.isArray(res) ? res : (res as PaginatedResponse<Product>).data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.load(), 400);
  }

  remove(p: Product): void {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    this.productSvc.remove(p.id).subscribe(() => this.load());
  }
}
