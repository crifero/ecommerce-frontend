import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { CreateOrderItemRequest } from '../../../core/models/order.model';

interface CartItem extends CreateOrderItemRequest {
  productName: string;
  price: number;
}

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  template: `
    <div class="page">
      <div class="page__header">
        <h2>Nuevo Pedido</h2>
      </div>
      <div class="order-form-grid">
        <div class="form-card">
          <h3>Seleccionar Productos</h3>
          @if (loadingProducts()) {
            <p class="state-msg">Cargando productos...</p>
          } @else {
            <div class="product-picker">
              @for (p of products(); track p.id) {
                <div class="product-picker__item" [class.selected]="isInCart(p.id)">
                  <div class="product-picker__info">
                    <strong>{{ p.name }}</strong>
                    <span>{{ p.price | currency }} · Stock: {{ p.stock }}</span>
                  </div>
                  <div class="product-picker__actions">
                    @if (isInCart(p.id)) {
                      <input
                        type="number"
                        min="1"
                        [max]="p.stock"
                        [value]="getQty(p.id)"
                        (change)="updateQty(p.id, +$any($event.target).value)"
                      />
                      <button class="btn btn--sm btn--danger" (click)="removeFromCart(p.id)">
                        ✕
                      </button>
                    } @else {
                      <button
                        class="btn btn--sm btn--primary"
                        (click)="addToCart(p)"
                        [disabled]="p.stock === 0"
                      >
                        Agregar
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <div class="form-card">
          <h3>Resumen del Pedido</h3>
          @if (cart().length === 0) {
            <p class="state-msg">Agrega productos a tu pedido.</p>
          } @else {
            <ul class="cart-list">
              @for (item of cart(); track item.productId) {
                <li>
                  <span>{{ item.productName }} × {{ item.quantity }}</span>
                  <span>{{ item.price * item.quantity | currency }}</span>
                </li>
              }
            </ul>
            <div class="cart-total">
              <strong>Total: {{ cartTotal() | currency }}</strong>
            </div>
          }
          <div class="field" style="margin-top:1rem">
            <label>Observaciones</label>
            <textarea name="observations" [(ngModel)]="observations" rows="2"></textarea>
          </div>
          @if (error()) {
            <p class="error">{{ error() }}</p>
          }
          <div class="form-actions">
            <button class="btn btn--ghost" (click)="cancel()">Cancelar</button>
            <button
              class="btn btn--primary"
              [disabled]="cart().length === 0 || loading()"
              (click)="submit()"
            >
              {{ loading() ? 'Enviando...' : 'Realizar Pedido' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OrderFormComponent implements OnInit {
  private readonly orderSvc = inject(OrderService);
  private readonly productSvc = inject(ProductService);
  private readonly router = inject(Router);

  products = signal<Product[]>([]);
  cart = signal<CartItem[]>([]);
  loadingProducts = signal(true);
  loading = signal(false);
  error = signal('');
  observations = '';

  cartTotal = () => this.cart().reduce((sum, i) => sum + i.price * i.quantity, 0);

  ngOnInit(): void {
    this.productSvc.findAll({ paginated: false } as any).subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : (res as any).data;
        this.products.set(list.filter((p: Product) => p.isActive && p.stock > 0));
        this.loadingProducts.set(false);
      },
      error: () => this.loadingProducts.set(false),
    });
  }

  isInCart(productId: number): boolean {
    return this.cart().some((i) => i.productId === productId);
  }

  getQty(productId: number): number {
    return this.cart().find((i) => i.productId === productId)?.quantity ?? 1;
  }

  addToCart(p: Product): void {
    this.cart.update((c) => [
      ...c,
      { productId: p.id, productName: p.name, price: p.price, quantity: 1 },
    ]);
  }

  removeFromCart(productId: number): void {
    this.cart.update((c) => c.filter((i) => i.productId !== productId));
  }

  updateQty(productId: number, qty: number): void {
    this.cart.update((c) =>
      c.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i)),
    );
  }

  submit(): void {
    this.loading.set(true);
    this.error.set('');
    this.orderSvc
      .create({
        items: this.cart().map((i) => ({ productId: i.productId, quantity: i.quantity })),
        observations: this.observations || undefined,
      })
      .subscribe({
        next: () => this.router.navigate(['/orders']),
        error: (err) => {
          this.error.set(err.error?.message ?? 'Error al realizar el pedido');
          this.loading.set(false);
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/orders']);
  }
}
