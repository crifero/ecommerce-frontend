import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page">
      <div class="page__header">
        <h2>{{ editId() ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
      </div>
      <div class="form-card">
        <form (ngSubmit)="submit()">
          <div class="field">
            <label>Nombre *</label>
            <input type="text" name="name" [(ngModel)]="form.name" required />
          </div>
          <div class="field">
            <label>Descripción</label>
            <textarea name="description" [(ngModel)]="form.description" rows="3"></textarea>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Precio *</label>
              <input type="number" name="price" [(ngModel)]="form.price" required min="0" step="0.01" />
            </div>
            <div class="field">
              <label>Stock</label>
              <input type="number" name="stock" [(ngModel)]="form.stock" min="0" />
            </div>
          </div>
          <div class="field field--checkbox">
            <label>
              <input type="checkbox" name="isActive" [(ngModel)]="form.isActive" />
              Activo
            </label>
          </div>
          @if (error()) {
            <p class="error">{{ error() }}</p>
          }
          <div class="form-actions">
            <button type="button" class="btn btn--ghost" (click)="cancel()">Cancelar</button>
            <button type="submit" class="btn btn--primary" [disabled]="loading()">
              {{ loading() ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ProductFormComponent implements OnInit {
  private productSvc = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editId = signal<number | null>(null);
  loading = signal(false);
  error = signal('');

  form = { name: '', description: '', price: 0, stock: 0, isActive: true };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(+id);
      this.productSvc.findOne(+id).subscribe(p => {
        this.form = { name: p.name, description: p.description ?? '', price: p.price, stock: p.stock, isActive: p.isActive };
      });
    }
  }

  submit(): void {
    this.loading.set(true);
    this.error.set('');
    const id = this.editId();
    const action = id
      ? this.productSvc.update(id, this.form)
      : this.productSvc.create(this.form);

    action.subscribe({
      next: () => this.router.navigate(['/products']),
      error: err => {
        this.error.set(err.error?.message ?? 'Error al guardar el producto');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
