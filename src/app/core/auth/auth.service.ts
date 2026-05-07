import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { delay, map, Observable, of } from 'rxjs';
import { AuthUser } from './auth.models';

const TOKEN_KEY = 'auth_token';

/** Encodes a user as a fake JWT so decodeToken() keeps working unchanged. */
function createMockToken(user: AuthUser): string {
  return `mock.${btoa(JSON.stringify(user))}.sig`;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  /** Reactive current user — consumed by ProfileDropdownComponent etc. */
  currentUser = signal<AuthUser | null>(this.decodeToken());

  login(email: string, _password: string): Observable<void> {
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
    const mockUser: AuthUser = {
      id: '1',
      name: role === 'admin' ? 'Demo Admin' : 'Demo User',
      email,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    };
    return of({ token: createMockToken(mockUser) }).pipe(
      delay(500),
      map(({ token }) => {
        localStorage.setItem(TOKEN_KEY, token);
        this.currentUser.set(mockUser);
      }),
    );
  }

  register(_name: string, _email: string, _password: string): Observable<void> {
    return of(undefined).pipe(delay(500));
  }

  forgotPassword(_email: string): Observable<void> {
    return of(undefined).pipe(delay(500));
  }

  resetPassword(_token: string, _password: string): Observable<void> {
    return of(undefined).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  switchDemoRole(): void {
    const user = this.currentUser();
    if (!user) return;
    const updated: AuthUser = { ...user, role: user.role === 'admin' ? 'user' : 'admin' };
    localStorage.setItem(TOKEN_KEY, createMockToken(updated));
    this.currentUser.set(updated);
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
    return this.currentUser();
  }

  hasRole(roles: string[]): boolean {
    const decoded = this.decodeToken();
    if (!decoded) return false;
    return roles.includes(decoded.role);
  }
}
