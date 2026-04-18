import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, FormsModule],
  template: `
    <div class="page">
      <div class="page__header">
        <h2>Mis Pedidos</h2>
        <div class="page__actions">
          <input type="date" class="input--date" [(ngModel)]="startDate" (change)="load()" />
          <input type="date" class="input--date" [(ngModel)]="endDate" (change)="load()" />
          <a class="btn btn--primary" routerLink="/orders/new">+ Nuevo Pedido</a>
        </div>
      </div>

      @if (loading()) {
        <p class="state-msg">Cargando...</p>
      } @else if (orders().length === 0) {
        <p class="state-msg">Aún no hay pedidos.</p>
      } @else {
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Artículos</th>
                <th>Fecha</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              @for (o of orders(); track o.id) {
                <tr>
                  <td>{{ o.id }}</td>
                  <td>
                    <span class="badge badge--status badge--{{ o.status }}">{{ o.status }}</span>
                  </td>
                  <td>{{ o.total | currency }}</td>
                  <td>{{ o.items.length }}</td>
                  <td>{{ o.createdAt | date: 'short' }}</td>
                  <td>{{ o.observations || '—' }}</td>
                </tr>
                <tr class="order-items-row">
                  <td colspan="6">
                    <div class="order-items">
                      @for (item of o.items; track item.id) {
                        <span class="order-item-chip">
                          {{ item.productName }} × {{ item.quantity }} ({{
                            item.subtotal | currency
                          }})
                        </span>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class OrderListComponent implements OnInit {
  private readonly orderSvc = inject(OrderService);

  orders = signal<Order[]>([]);
  loading = signal(true);
  startDate = '';
  endDate = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    const params: any = {};
    if (this.startDate) params.startDate = this.startDate;
    if (this.endDate) params.endDate = this.endDate;

    this.orderSvc.findAll(params).subscribe({
      next: (res) => {
        this.orders.set(Array.isArray(res) ? res : res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
