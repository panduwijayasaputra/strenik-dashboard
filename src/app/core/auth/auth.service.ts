import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser } from './auth.models';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<{ token: string }>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(map(({ token }) => { localStorage.setItem(TOKEN_KEY, token); }));
  }

  register(name: string, email: string, password: string): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/auth/register`, { name, email, password });
  }

  forgotPassword(email: string): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/auth/reset-password`, { token, password });
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  decodeToken(): AuthUser | null {
    try {
      const token = this.getToken();
      if (!token) return null;
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload)) as AuthUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const decoded = this.decodeToken();
    if (!decoded) return false;
    return decoded.exp * 1000 > Date.now();
  }

  getCurrentUser(): AuthUser | null {
    return this.decodeToken();
  }

  hasRole(roles: string[]): boolean {
    const decoded = this.decodeToken();
    if (!decoded) return false;
    return roles.includes(decoded.role);
  }
}
