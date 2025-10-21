import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environments';
import { UserData } from '../models/userData';
import { UserForm } from '../models/userForm';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private readonly USER_DATA_KEY = 'userData';

  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private router: Router, private http: HttpClient) { }

  login(credentials: UserForm): Observable<UserData> {
    return this.http.post<UserData>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify(response));
        this.loggedIn.next(true);
      })
    );
  }

  signup(credentials: UserForm): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/signup`, credentials);
  }

  logout(): void {
    sessionStorage.removeItem(this.USER_DATA_KEY);
    this.loggedIn.next(false);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.USER_DATA_KEY);
  }

  getUser(): UserData | null {
    const userData = sessionStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}