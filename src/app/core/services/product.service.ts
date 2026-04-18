import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, CreateProductRequest, UpdateProductRequest, ProductSearchParams, PaginatedResponse } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  findAll(params: ProductSearchParams = {}): Observable<Product[] | PaginatedResponse<Product>> {
    let p = new HttpParams();
    if (params.page) p = p.set('page', params.page);
    if (params.size) p = p.set('size', params.size);
    if (params.paginated) p = p.set('paginated', params.paginated);
    if (params.name) p = p.set('name', params.name);
    return this.http.get<Product[] | PaginatedResponse<Product>>(this.base, { params: p });
  }

  findOne(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  create(body: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.base, body);
  }

  update(id: number, body: UpdateProductRequest): Observable<Product> {
    return this.http.patch<Product>(`${this.base}/${id}`, body);
  }

  remove(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
