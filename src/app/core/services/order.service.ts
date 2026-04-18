import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest, OrderSearchParams } from '../models/order.model';
import { PaginatedResponse } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly base = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  findAll(params: OrderSearchParams = {}): Observable<Order[] | PaginatedResponse<Order>> {
    let p = new HttpParams();
    if (params.page) p = p.set('page', params.page);
    if (params.size) p = p.set('size', params.size);
    if (params.paginated) p = p.set('paginated', params.paginated);
    if (params.startDate) p = p.set('startDate', params.startDate);
    if (params.endDate) p = p.set('endDate', params.endDate);
    return this.http.get<Order[] | PaginatedResponse<Order>>(this.base, { params: p });
  }

  findOne(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`);
  }

  create(body: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.base, body);
  }
}
