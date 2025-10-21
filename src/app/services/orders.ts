import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { OrderItemForm } from '../models/order-item';
import { PaginatedResponse } from '../models/paginatedResponse';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // ## CORRECTED API URLS ##
  // URL for creating a new order with its items
  private orderItemsApiUrl = `${environment.apiUrl}/orderItems`; 
  // URL for fetching the list of existing orders
  private ordersApiUrl = `${environment.apiUrl}/orders`; 

  constructor(private http: HttpClient) { }

  /**
   * Creates a new order by sending a list of items to the /orderItems endpoint.
   */
  createOrder(orderItems: OrderItemForm[]): Observable<any> {
    return this.http.post(this.orderItemsApiUrl, orderItems);
  }

  /**
   * Fetches a paginated list of existing orders from the /orders endpoint.
   */
  getAll(page: number, size: number): Observable<PaginatedResponse<Order>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    // Use the correct URL for fetching orders
    return this.http.get<PaginatedResponse<Order>>(this.ordersApiUrl, { params });
  }

  downloadInvoice(orderId: number): Observable<any> {
    return this.http.post(`${this.ordersApiUrl}/api/order/${orderId}/finalize`, {});
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.ordersApiUrl}/cancel/${orderId}`, null);
  }
}

