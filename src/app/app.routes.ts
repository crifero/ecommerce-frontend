import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
      },
    ],
  },
  {
    path: 'products',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent),
      },
      {
        path: 'new',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent),
      },
      {
        path: ':id/edit',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent),
      },
    ],
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent),
      },
      {
        path: 'new',
        loadComponent: () => import('./features/orders/order-form/order-form.component').then(m => m.OrderFormComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/products' },
];
