# Project Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize the Angular app from `core/`+`models/` architecture to the flat `shared/`+`layout/`+`features/` structure defined in `docs/project-structure.md`, and add stub files for all new artifacts.

**Architecture:** Eliminate the `core/` and top-level `models/` directories; distribute their contents into `shared/services/`, `shared/guards/`, `shared/interceptors/`, and `shared/models/`. Rename layout components to match the new naming convention. Add stub files for all new features and shared artifacts defined in the structure doc.

**Tech Stack:** Angular 20+ standalone components, Signals, Tailwind CSS, Lucide Angular, Angular Material

---

## Task 1: Move `core/` → `shared/`

**Files:**
- Create: `src/app/shared/services/auth.service.ts`
- Create: `src/app/shared/services/base.service.ts`
- Create: `src/app/shared/services/theme.service.ts`
- Create: `src/app/shared/services/layout.service.ts`
- Create: `src/app/shared/services/breadcrumb.service.ts`
- Create: `src/app/shared/guards/auth.guard.ts`
- Create: `src/app/shared/interceptors/auth.interceptor.ts`
- Create: `src/app/shared/interceptors/error.interceptor.ts`
- Delete: `src/app/core/` (entire directory)

**Step 1:** Create `shared/services/auth.service.ts` — copy from `core/auth/auth.service.ts`, fix internal import `../../models/auth.model` → `../models/auth.model`

```typescript
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { delay, map, Observable, of } from 'rxjs';
import { AuthUser } from '../models/auth.model';

const TOKEN_KEY = 'auth_token';

function createMockToken(user: AuthUser): string {
  return `mock.${btoa(JSON.stringify(user))}.sig`;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

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
```

**Step 2:** Create `shared/services/base.service.ts` — copy from `core/api/base-api.service.ts`, rename class `BaseApiService` → `BaseService`

```typescript
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseService {
  private readonly http = inject(HttpClient);

  protected get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(environment.apiUrl + path, { params });
  }

  protected post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(environment.apiUrl + path, body);
  }

  protected put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(environment.apiUrl + path, body);
  }

  protected patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(environment.apiUrl + path, body);
  }

  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(environment.apiUrl + path);
  }
}
```

**Step 3:** Create `shared/services/theme.service.ts` — copy from `core/theme/theme.service.ts` unchanged

**Step 4:** Create `shared/services/layout.service.ts` — copy from `core/services/layout.service.ts` unchanged

**Step 5:** Create `shared/services/breadcrumb.service.ts` — copy from `core/services/breadcrumb.service.ts` unchanged

**Step 6:** Create `shared/guards/auth.guard.ts` — fix import `../auth/auth.service` → `../services/auth.service`

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? true : router.createUrlTree(['/auth/login']);
};
```

**Step 7:** Create `shared/interceptors/auth.interceptor.ts` — fix import `../auth/auth.service` → `../services/auth.service`

```typescript
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    }),
  );
};
```

**Step 8:** Create `shared/interceptors/error.interceptor.ts` — copy unchanged

```typescript
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`HTTP Error ${error.status}: ${error.message}`);
      return throwError(() => error);
    })
  );
```

**Step 9:** Delete `src/app/core/` directory:
```bash
rm -rf src/app/core
```

---

## Task 2: Move `models/` → `shared/models/`

**Files:**
- Create: `src/app/shared/models/auth.model.ts`
- Create: `src/app/shared/models/nav-item.model.ts`
- Create: `src/app/shared/models/nav-items.config.ts`
- Create: `src/app/shared/models/base.model.ts`
- Create: `src/app/shared/models/user.model.ts`
- Create: `src/app/shared/models/organization.model.ts`
- Delete: `src/app/models/` (entire directory)

**Step 1:** Create `shared/models/auth.model.ts` — copy from `models/auth.model.ts` unchanged

```typescript
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  exp: number;
}
```

**Step 2:** Create `shared/models/nav-item.model.ts` — copy unchanged

```typescript
export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}
```

**Step 3:** Create `shared/models/nav-items.config.ts` — same folder so no import change needed

```typescript
import { NavItem } from './nav-item.model';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'layout-dashboard', route: '/dashboard' },
  {
    label: 'Users',
    icon: 'users',
    children: [
      { label: 'User List', icon: 'list', route: '/users' },
      { label: 'Create User', icon: 'user-plus', route: '/users/new' },
    ],
  },
  {
    label: 'Audits',
    icon: 'shield-check',
    children: [
      { label: 'Audit List', icon: 'list', route: '/audits' },
    ],
  },
  { label: 'Organization', icon: 'building', route: '/organization' },
  { label: 'Activity Logs', icon: 'activity', route: '/activity-logs' },
  { label: 'Settings', icon: 'settings', route: '/settings' },
];
```

**Step 4:** Create `shared/models/base.model.ts`

```typescript
export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}
```

**Step 5:** Create `shared/models/user.model.ts`

```typescript
import { BaseModel } from './base.model';

export interface User extends BaseModel {
  name: string;
  email: string;
  role: string;
  organizationId?: string;
}
```

**Step 6:** Create `shared/models/organization.model.ts`

```typescript
import { BaseModel } from './base.model';

export interface Organization extends BaseModel {
  name: string;
  slug: string;
  tokenLimit: number;
}
```

**Step 7:** Delete old `models/` directory:
```bash
rm -rf src/app/models
```

---

## Task 3: Add new `shared/services/` stubs

**Files:**
- Create: `src/app/shared/services/toast.service.ts`
- Create: `src/app/shared/services/organization.service.ts`
- Create: `src/app/shared/services/user-management.service.ts`
- Create: `src/app/shared/services/error-handler.service.ts`
- Create: `src/app/shared/services/logging.service.ts`

**Step 1:** Create `shared/services/toast.service.ts`

```typescript
import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info'): void {
    const id = crypto.randomUUID();
    this.toasts.update(t => [...t, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: string): void {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
```

**Step 2:** Create `shared/services/organization.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Organization } from '../models/organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  getAll(): Observable<Organization[]> {
    return of([]);
  }

  getById(id: string): Observable<Organization> {
    return of({ id, name: 'Mock Org', slug: 'mock-org', tokenLimit: 1000, createdAt: '', updatedAt: '' });
  }
}
```

**Step 3:** Create `shared/services/user-management.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  getAll(): Observable<User[]> {
    return of([]);
  }
}
```

**Step 4:** Create `shared/services/error-handler.service.ts`

```typescript
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  handleError(error: unknown): void {
    console.error('[GlobalError]', error);
  }
}
```

**Step 5:** Create `shared/services/logging.service.ts`

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  log(message: string, ...args: unknown[]): void {
    console.log(`[LOG] ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  }
}
```

---

## Task 4: Add new `shared/interceptors/` stubs

**Files:**
- Create: `src/app/shared/interceptors/logging.interceptor.ts`
- Create: `src/app/shared/interceptors/api-response-unwrapper.interceptor.ts`

**Step 1:** Create `shared/interceptors/logging.interceptor.ts`

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoggingService } from '../services/logging.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);
  logger.log(`HTTP ${req.method} ${req.url}`);
  return next(req).pipe(
    tap({ error: err => logger.error(`HTTP error ${req.url}`, err) })
  );
};
```

**Step 2:** Create `shared/interceptors/api-response-unwrapper.interceptor.ts`

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { map } from 'rxjs';

export const apiResponseUnwrapperInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(map(event => event));
```

---

## Task 5: Add `shared/` utilities, constants, and pipes

**Files:**
- Create: `src/app/shared/constants/roles.ts`
- Create: `src/app/shared/utils/error.utils.ts`
- Create: `src/app/shared/pipes/format-date.pipe.ts`
- Create: `src/app/shared/pipes/format-status.pipe.ts`

**Step 1:** Delete the existing `.gitkeep` in pipes: `rm src/app/shared/pipes/.gitkeep`

**Step 2:** Create `shared/constants/roles.ts`

```typescript
export const ROLES = {
  ADMIN: 'admin',
  AUDITOR: 'auditor',
  AUDITEE: 'auditee',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
```

**Step 3:** Create `shared/utils/error.utils.ts`

```typescript
import { HttpErrorResponse } from '@angular/common/http';

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return (error.error as { message?: string })?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
}
```

**Step 4:** Create `shared/pipes/format-date.pipe.ts`

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDate', standalone: true })
export class FormatDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format: 'short' | 'long' = 'short'): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: format,
    }).format(new Date(value));
  }
}
```

**Step 5:** Create `shared/pipes/format-status.pipe.ts`

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatStatus', standalone: true })
export class FormatStatusPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '-';
    return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
```

---

## Task 6: Add `shared/components/ui/` library

**Files:** 13 UI components + 1 unauthorized component

**Step 1:** Create `shared/components/ui/button.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button [class]="buttonClass()" [disabled]="disabled()" (click)="clicked.emit()">
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  clicked = output<void>();

  buttonClass() {
    const base = 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none disabled:opacity-50';
    const variants: Record<string, string> = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      danger: 'bg-danger text-white hover:bg-danger/90',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    };
    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  }
}
```

**Step 2:** Create `shared/components/ui/input.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <input
      class="w-full rounded border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      [type]="type()"
      [placeholder]="placeholder()"
      [(ngModel)]="value" />
  `,
})
export class InputComponent {
  type = input('text');
  placeholder = input('');
  value = model('');
}
```

**Step 3:** Create `shared/components/ui/select.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <select
      class="w-full rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      [(ngModel)]="value">
      <ng-content />
    </select>
  `,
})
export class SelectComponent {
  value = model('');
}
```

**Step 4:** Create `shared/components/ui/card.component.ts`

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <ng-content />
    </div>
  `,
})
export class CardComponent {}
```

**Step 5:** Create `shared/components/ui/modal.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" (click)="closed.emit()">
        <div class="w-full max-w-lg rounded-lg bg-card p-6 shadow-xl" (click)="$event.stopPropagation()">
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  open = input(false);
  closed = output<void>();
}
```

**Step 6:** Create `shared/components/ui/alert.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="alertClass()"><ng-content /></div>`,
})
export class AlertComponent {
  type = input<'info' | 'success' | 'warning' | 'danger'>('info');

  alertClass() {
    const v: Record<string, string> = {
      info: 'bg-blue-50 text-blue-800 border-blue-200',
      success: 'bg-green-50 text-green-800 border-green-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      danger: 'bg-red-50 text-red-800 border-red-200',
    };
    return `rounded border p-4 text-sm ${v[this.type()]}`;
  }
}
```

**Step 7:** Create `shared/components/ui/spinner.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="'animate-spin rounded-full border-2 border-muted border-t-primary ' + sizeClass()"></div>`,
})
export class SpinnerComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
  sizeClass() { return { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }[this.size()]; }
}
```

**Step 8:** Create `shared/components/ui/badge.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="badgeClass()"><ng-content /></span>`,
})
export class BadgeComponent {
  variant = input<'default' | 'success' | 'warning' | 'danger'>('default');

  badgeClass() {
    const v: Record<string, string> = {
      default: 'bg-secondary text-secondary-foreground',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
    };
    return `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${v[this.variant()]}`;
  }
}
```

**Step 9:** Create `shared/components/ui/avatar.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
      {{ initials() }}
    </div>
  `,
})
export class AvatarComponent {
  name = input('');
  initials() { return this.name().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
}
```

**Step 10:** Create `shared/components/ui/checkbox.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <label class="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" class="h-4 w-4 rounded border-input accent-primary" [(ngModel)]="checked" />
      <ng-content />
    </label>
  `,
})
export class CheckboxComponent {
  checked = model(false);
}
```

**Step 11:** Create `shared/components/ui/switch.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, model } from '@angular/core';

@Component({
  selector: 'app-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" role="switch" [attr.aria-checked]="checked()"
      [class]="checked() ? 'bg-primary' : 'bg-muted'"
      class="relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors"
      (click)="checked.set(!checked())">
      <span [class]="checked() ? 'translate-x-4' : 'translate-x-0'"
        class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"></span>
    </button>
  `,
})
export class SwitchComponent {
  checked = model(false);
}
```

**Step 12:** Create `shared/components/ui/tooltip.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group relative inline-block">
      <ng-content />
      <span class="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
        {{ text() }}
      </span>
    </div>
  `,
})
export class TooltipComponent {
  text = input('');
}
```

**Step 13:** Create `shared/components/ui/toast-container.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div [class]="toastClass(toast.type)" class="flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium min-w-64">
          {{ toast.message }}
          <button class="ml-auto opacity-70 hover:opacity-100" (click)="toastService.dismiss(toast.id)">&#x2715;</button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  toastClass(type: string) {
    const v: Record<string, string> = {
      success: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      warning: 'bg-yellow-500 text-white',
      info: 'bg-primary text-primary-foreground',
    };
    return v[type] ?? v['info'];
  }
}
```

**Step 14:** Create `shared/components/unauthorized/unauthorized.component.ts`

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full flex-col items-center justify-center gap-4 text-center p-8">
      <h2 class="text-2xl font-bold text-foreground">Access Denied</h2>
      <p class="text-muted-foreground">You do not have permission to view this page.</p>
    </div>
  `,
})
export class UnauthorizedComponent {}
```

---

## Task 7: Reorganize `layout/`

Rename `admin-layout` → `main-layout`, `top-navbar` → `header`, move `auth-layout` → `empty-layout/`, add `footer/`.

**Step 1:** Read `src/app/layout/admin-layout/admin-layout.component.html`, then create `src/app/layout/main-layout/main-layout.component.html` with the same content.

**Step 2:** Create `src/app/layout/main-layout/main-layout.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../shared/services/layout.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, BreadcrumbComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  readonly layoutService = inject(LayoutService);
}
```

**Step 3:** Read `src/app/layout/admin-layout/admin-layout.component.spec.ts`, then create `src/app/layout/main-layout/main-layout.component.spec.ts` updating class references from `AdminLayoutComponent` → `MainLayoutComponent` and import paths.

**Step 4:** Read `src/app/layout/top-navbar/top-navbar.component.html`, then create `src/app/layout/header/header.component.html` with same content.

**Step 5:** Create `src/app/layout/header/header.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { LayoutService } from '../../shared/services/layout.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { NotificationsDropdownComponent } from '../notifications/notifications-dropdown.component';
import { ProfileDropdownComponent } from '../profile-dropdown/profile-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, ThemeSwitcherComponent, NotificationsDropdownComponent, ProfileDropdownComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly layoutService = inject(LayoutService);
  readonly searchFocused = signal(false);
}
```

**Step 6:** Read `src/app/features/auth/auth-layout/auth-layout.component.ts`, then create `src/app/layout/empty-layout/empty-layout.component.ts` renaming class to `EmptyLayoutComponent` and selector to `app-empty-layout`.

**Step 7:** Create `src/app/layout/footer/footer.component.ts`

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-border bg-card px-6 py-4 text-center text-sm text-muted-foreground">
      &copy; {{ year }} Strenik. All rights reserved.
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
```

**Step 8:** Read each of the following and update `../../core/services/` imports → `../../shared/services/`:
- `src/app/layout/sidebar/sidebar.component.ts`
- `src/app/layout/breadcrumb/breadcrumb.component.ts`
- `src/app/layout/notifications/notifications-dropdown.component.ts`
- `src/app/layout/profile-dropdown/profile-dropdown.component.ts`
- `src/app/layout/theme-switcher/theme-switcher.component.ts`

Also update sidebar's nav-item/nav-group imports of models from `../../../models/` → `../../../shared/models/`.

**Step 9:** Delete old directories:
```bash
rm -rf src/app/layout/admin-layout
rm -rf src/app/layout/top-navbar
rm src/app/layout/index.ts
rm -rf src/app/features/auth/auth-layout
```

---

## Task 8: Update `app.routes.ts` and `app.config.ts`

**Step 1:** Rewrite `src/app/app.routes.ts`:
- Guard import: `./core/guards/auth.guard` → `./shared/guards/auth.guard`
- Layout import: `./layout/admin-layout/admin-layout.component` (AdminLayoutComponent) → `./layout/main-layout/main-layout.component` (MainLayoutComponent)
- Auth route `loadComponent`: `./features/auth/auth-layout/auth-layout.component` → `./layout/empty-layout/empty-layout.component` (EmptyLayoutComponent)
- Remove `products` and `profile` routes
- Update `users` to use lazy children: `loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES)`
- Add placeholder routes for `audits`, `organization`, `activity-logs`, `settings`
- Keep catch-all `**` pointing to a simple not-found stub (create one at `shared/components/not-found.component.ts`)

**Step 2:** Rewrite `src/app/app.config.ts`:
- Change interceptor imports: `./core/interceptors/error.interceptor` → `./shared/interceptors/error.interceptor`
- Change interceptor imports: `./core/interceptors/auth.interceptor` → `./shared/interceptors/auth.interceptor`

---

## Task 9: Reorganize `features/users/`

**Step 1:** Read `src/app/features/users/users.service.ts`, create `src/app/features/users/services/user.service.ts` — rename class `UsersService` → `UserService`, fix any import paths.

**Step 2:** Read `src/app/features/users/user-list/user-list.component.ts`, create `src/app/features/users/components/user-list/user-list.component.ts` — update service import to `../../services/user.service`.

**Step 3:** Create `src/app/features/users/components/user-form/user-form.component.ts` (stub)

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">User form — coming soon.</p>`,
})
export class UserFormComponent {}
```

**Step 4:** Create `src/app/features/users/users.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/user-list/user-list.component').then(m => m.UserListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/user-form/user-form.component').then(m => m.UserFormComponent),
  },
];
```

**Step 5:** Delete old files:
```bash
rm src/app/features/users/users.service.ts
rm src/app/features/users/users.model.ts
rm -rf src/app/features/users/user-list
```

---

## Task 10: Remove deprecated features, update auth feature

**Step 1:** Delete deprecated features:
```bash
rm -rf src/app/features/products
rm -rf src/app/features/profile
rm -rf src/app/features/not-found
rm src/app/features/auth/auth.component.ts
rm -rf src/app/features/auth/register
rm -rf src/app/features/auth/forgot-password
rm -rf src/app/features/auth/reset-password
```

**Step 2:** Create `src/app/features/auth/change-password/change-password.component.ts`

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-change-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Change password — coming soon.</p>`,
})
export class ChangePasswordComponent {}
```

**Step 3:** Read `src/app/features/auth/auth.routes.ts`, rewrite to keep only `login` and add `change-password`:

```typescript
import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./change-password/change-password.component').then(m => m.ChangePasswordComponent),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
```

**Step 4:** Read `src/app/features/auth/login/login.component.ts`, update AuthService import: `../../../core/auth/auth.service` → `../../../shared/services/auth.service`.

---

## Task 11: Add new feature stubs — `features/dashboard/` additions

**Files:**
- Create: `src/app/features/dashboard/dashboard.service.ts`
- Create: `src/app/features/dashboard/dashboard.model.ts`
- Create: `src/app/features/dashboard/auditor-dashboard/auditor-dashboard.component.ts`
- Create: `src/app/features/dashboard/auditee-dashboard/auditee-dashboard.component.ts`

**Step 1:** Create `features/dashboard/dashboard.model.ts`

```typescript
export interface DashboardStats {
  totalAudits: number;
  openFindings: number;
  completedAudits: number;
  pendingRemediation: number;
}
```

**Step 2:** Create `features/dashboard/dashboard.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardStats } from './dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  getStats(): Observable<DashboardStats> {
    return of({ totalAudits: 0, openFindings: 0, completedAudits: 0, pendingRemediation: 0 });
  }
}
```

**Step 3:** Create `features/dashboard/auditor-dashboard/auditor-dashboard.component.ts`

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auditor-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Auditor dashboard — coming soon.</p>`,
})
export class AuditorDashboardComponent {}
```

**Step 4:** Create `features/dashboard/auditee-dashboard/auditee-dashboard.component.ts`

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auditee-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Auditee dashboard — coming soon.</p>`,
})
export class AuditeeDashboardComponent {}
```

---

## Task 12: Add new feature stubs — `features/audits/`

**Step 1:** Create `features/audits/audit.model.ts`

```typescript
import { BaseModel } from '../../shared/models/base.model';

export type AuditStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';

export interface Audit extends BaseModel {
  title: string;
  description: string;
  status: AuditStatus;
  organizationId: string;
  templateId?: string;
  assignedAuditorId?: string;
}
```

**Step 2:** Create `features/audits/audit.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Audit } from './audit.model';

@Injectable({ providedIn: 'root' })
export class AuditService {
  getAll(): Observable<Audit[]> { return of([]); }
  getById(id: string): Observable<Audit | undefined> { return of(undefined); }
}
```

**Step 3:** Create component stubs for: `audit-list/audit-list.component.ts`, `audit-form/audit-form.component.ts`, `audit-detail/audit-detail.component.ts`, `assignment/audit-assignment.component.ts`, `checklist-execution/checklist-execution.component.ts`

Use the stub template:
```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({ selector: 'app-{name}', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: `<p class="p-6 text-muted-foreground">{Label} — coming soon.</p>` })
export class {Name}Component {}
```

**Step 4:** Create `features/audits/findings/finding.model.ts`

```typescript
import { BaseModel } from '../../../shared/models/base.model';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';
export type FindingStatus = 'open' | 'in_remediation' | 'resolved' | 'verified';

export interface Finding extends BaseModel {
  auditId: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
}
```

**Step 5:** Create `features/audits/findings/finding.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Finding } from './finding.model';

@Injectable({ providedIn: 'root' })
export class FindingService {
  getByAudit(auditId: string): Observable<Finding[]> { return of([]); }
}
```

**Step 6:** Create stub components: `findings/finding-list.component.ts`, `findings/finding-form-modal.component.ts`, `findings/remediation-modal.component.ts`, `findings/verification-modal.component.ts`

**Step 7:** Create `features/audits/audits.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const AUDITS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./audit-list/audit-list.component').then(m => m.AuditListComponent) },
  { path: 'new', loadComponent: () => import('./audit-form/audit-form.component').then(m => m.AuditFormComponent) },
  { path: ':id', loadComponent: () => import('./audit-detail/audit-detail.component').then(m => m.AuditDetailComponent) },
];
```

---

## Task 13: Add new feature stubs — `features/activity-logs/`

**Step 1:** Create `features/activity-logs/activity-log.model.ts`

```typescript
import { BaseModel } from '../../shared/models/base.model';

export interface ActivityLog extends BaseModel {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}
```

**Step 2:** Create `features/activity-logs/activity-log.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivityLog } from './activity-log.model';

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  getAll(): Observable<ActivityLog[]> { return of([]); }
}
```

**Step 3:** Create `features/activity-logs/activity-log-list.component.ts`

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({ selector: 'app-activity-log-list', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: `<p class="p-6 text-muted-foreground">Activity logs — coming soon.</p>` })
export class ActivityLogListComponent {}
```

**Step 4:** Create `features/activity-logs/activity-logs.routes.ts`

```typescript
import { Routes } from '@angular/router';
export const ACTIVITY_LOGS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./activity-log-list.component').then(m => m.ActivityLogListComponent) },
];
```

---

## Task 14: Add new feature stubs — `features/notifications/`

**Step 1:** Create `features/notifications/notification.model.ts`

```typescript
export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  iconUrl?: string;
}
```

**Step 2:** Create `features/notifications/notification.service.ts` — move content from `core/services/notifications.service.ts`, rename class `NotificationsService` → `NotificationService`, rename `Notification` interface to avoid collision (already in model file — import from there)

```typescript
import { Injectable, computed, signal } from '@angular/core';
import { Notification } from './notification.model';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New audit assigned', description: 'You have been assigned to Q2 Audit.', timestamp: new Date(Date.now() - 5 * 60 * 1000), read: false },
  { id: '2', title: 'Finding resolved', description: 'Finding #42 has been resolved.', timestamp: new Date(Date.now() - 30 * 60 * 1000), read: false },
  { id: '3', title: 'Report ready', description: 'Your April audit report is available.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: true },
];

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notifications = signal<Notification[]>(MOCK_NOTIFICATIONS);
  readonly unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  markRead(id: string): void {
    this.notifications.update(items => items.map(n => n.id === id ? { ...n, read: true } : n));
  }

  markAllRead(): void {
    this.notifications.update(items => items.map(n => ({ ...n, read: true })));
  }
}
```

**Step 3:** Create `features/notifications/notification-bell.component.ts`

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({ selector: 'app-notification-bell', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: `<p class="p-6 text-muted-foreground">Notification bell — coming soon.</p>` })
export class NotificationBellComponent {}
```

**Step 4:** Create `features/notifications/notification-list.component.ts`

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({ selector: 'app-notification-list', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: `<p class="p-6 text-muted-foreground">Notification list — coming soon.</p>` })
export class NotificationListComponent {}
```

**Step 5:** Update `src/app/layout/notifications/notifications-dropdown.component.ts` to import `NotificationService` from `../../features/notifications/notification.service` instead of the old `core/services/notifications.service`.

---

## Task 15: Add new feature stubs — `features/organization/`

**Step 1:** Create `features/organization/validators/token-limit.validator.ts`

```typescript
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function tokenLimitValidator(control: AbstractControl): ValidationErrors | null {
  const value = Number(control.value);
  if (isNaN(value) || value < 0) return { tokenLimit: 'Must be a non-negative number' };
  return null;
}
```

**Step 2:** Create stub components:
- `features/organization/components/organization-list/organization-list.component.ts`
- `features/organization/components/organization-form/organization-form.component.ts`
- `features/organization/components/organization-settings/organization-settings.component.ts`

**Step 3:** Create `features/organization/organization.routes.ts`

```typescript
import { Routes } from '@angular/router';
export const ORGANIZATION_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./components/organization-list/organization-list.component').then(m => m.OrganizationListComponent) },
  { path: 'new', loadComponent: () => import('./components/organization-form/organization-form.component').then(m => m.OrganizationFormComponent) },
  { path: 'settings', loadComponent: () => import('./components/organization-settings/organization-settings.component').then(m => m.OrganizationSettingsComponent) },
];
```

---

## Task 16: Add new feature stubs — `features/settings/`

**Step 1:** Create model stubs:
- `features/settings/severity-levels/models/severity-level.model.ts`
- `features/settings/audit-templates/models/audit-template.model.ts`

**Step 2:** Create service stubs:
- `features/settings/severity-levels/services/severity-level.service.ts`
- `features/settings/audit-templates/services/audit-template.service.ts`

**Step 3:** Create component stubs:
- `features/settings/severity-levels/components/severity-level-list/severity-level-list.component.ts`
- `features/settings/severity-levels/components/severity-level-form/severity-level-form.component.ts`
- `features/settings/audit-templates/components/audit-template-list/audit-template-list.component.ts`
- `features/settings/audit-templates/components/audit-template-form/audit-template-form.component.ts`

**Step 4:** Create `features/settings/audit-templates/audit-templates.routes.ts`

```typescript
import { Routes } from '@angular/router';
export const AUDIT_TEMPLATES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./components/audit-template-list/audit-template-list.component').then(m => m.AuditTemplateListComponent) },
  { path: 'new', loadComponent: () => import('./components/audit-template-form/audit-template-form.component').then(m => m.AuditTemplateFormComponent) },
];
```

**Step 5:** Create `features/settings/settings.routes.ts`

```typescript
import { Routes } from '@angular/router';
export const SETTINGS_ROUTES: Routes = [
  { path: '', redirectTo: 'severity-levels', pathMatch: 'full' },
  {
    path: 'severity-levels',
    loadComponent: () => import('./severity-levels/components/severity-level-list/severity-level-list.component').then(m => m.SeverityLevelListComponent),
  },
  {
    path: 'audit-templates',
    loadChildren: () => import('./audit-templates/audit-templates.routes').then(m => m.AUDIT_TEMPLATES_ROUTES),
  },
];
```

---

## Task 17: Final wiring — update `app.routes.ts` fully and spec files

**Step 1:** Write final `src/app/app.routes.ts` with all new routes:

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () =>
      import('./layout/empty-layout/empty-layout.component').then(m => m.EmptyLayoutComponent),
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'users',
        data: { breadcrumb: 'Users' },
        loadChildren: () =>
          import('./features/users/users.routes').then(m => m.USERS_ROUTES),
      },
      {
        path: 'audits',
        data: { breadcrumb: 'Audits' },
        loadChildren: () =>
          import('./features/audits/audits.routes').then(m => m.AUDITS_ROUTES),
      },
      {
        path: 'organization',
        data: { breadcrumb: 'Organization' },
        loadChildren: () =>
          import('./features/organization/organization.routes').then(m => m.ORGANIZATION_ROUTES),
      },
      {
        path: 'activity-logs',
        data: { breadcrumb: 'Activity Logs' },
        loadChildren: () =>
          import('./features/activity-logs/activity-logs.routes').then(m => m.ACTIVITY_LOGS_ROUTES),
      },
      {
        path: 'settings',
        data: { breadcrumb: 'Settings' },
        loadChildren: () =>
          import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
  },
];
```

**Step 2:** Read and update each failing spec file — fix import paths for moved services/components.

**Step 3:** Build and run tests:

```bash
pnpm build 2>&1 | tail -30
pnpm test --run 2>&1 | tail -20
```

Expected: build succeeds, tests pass (or fail only for known stub reasons).

---

## Task 18: Commit

```bash
git add -A
git commit -m "refactor: restructure app to shared/ layout per updated project-structure doc

- Eliminate core/ and models/ — distribute to shared/services, shared/guards, shared/interceptors, shared/models
- Rename AdminLayoutComponent → MainLayoutComponent, TopNavbarComponent → HeaderComponent
- Move auth-layout → layout/empty-layout/
- Add layout/footer/
- Reorganize features/users/ with services/ and components/ sub-folders
- Add full stub trees: audits, activity-logs, notifications, organization, settings
- Add shared UI component library (13 components)
- Add shared pipes, constants, utils
- Update app.routes.ts and app.config.ts to new paths"
```
