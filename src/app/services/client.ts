import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Client } from '../models/client';
import { PaginatedResponse } from '../models/paginatedResponse';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private baseUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number): Observable<PaginatedResponse<Client>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    // Ensure the http.get call also expects the PaginatedResponse type
    return this.http.get<PaginatedResponse<Client>>(this.baseUrl, { params });
  }
  
  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  add(client: Client): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, client);
  }

  update(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, client);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadTsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.baseUrl}/file`, formData);
  }
}
