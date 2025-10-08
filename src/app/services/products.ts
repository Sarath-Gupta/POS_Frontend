import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Product } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) {}
  
    getAll(): Observable<Product[]> {
      return this.http.get<Product[]>(this.baseUrl);
    }
    
    getById(id: number): Observable<Product> {
      return this.http.get<Product>(`${this.baseUrl}/${id}`);
    }
  
    add(client: Product): Observable<Product> {
      return this.http.post<Product>(this.baseUrl, client);
    }
  
    update(id: number, client: Product): Observable<Product> {
      return this.http.put<Product>(`${this.baseUrl}/${id}`, client);
    }
  
}
