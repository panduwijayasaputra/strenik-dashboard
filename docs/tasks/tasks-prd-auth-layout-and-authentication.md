## Relevant Files

- `src/app/core/auth/auth.models.ts` - `AuthUser` interface and auth-related types.
- `src/app/core/auth/auth.service.ts` - Injectable auth service: login, register, forgot/reset password, JWT decode, role check.
- `src/app/core/guards/auth.guard.ts` - Updated functional auth guard using `AuthService.isAuthenticated()`.
- `src/app/core/interceptors/auth.interceptor.ts` - Functional HTTP interceptor: attaches Bearer token, calls logout on 401.
- `src/app/core/interceptors/error.interceptor.ts` - Existing error interceptor (no changes expected).
- `src/app/shared/directives/has-permission.directive.ts` - Structural directive `*hasPermission` for role-based element visibility.
- `src/app/features/auth/auth-layout/auth-layout.component.ts` - Split-screen layout shell for all auth pages.
- `src/app/features/auth/login/login.component.ts` - Login page with email + password form.
- `src/app/features/auth/register/register.component.ts` - Register page with name, email, password, confirm password.
- `src/app/features/auth/forgot-password/forgot-password.component.ts` - Forgot password page with email field.
- `src/app/features/auth/reset-password/reset-password.component.ts` - Reset password page with new password + confirm.
- `src/app/features/auth/auth.routes.ts` - Child routes for the auth feature (login, register, forgot, reset).
- `src/app/app.routes.ts` - Root routes — update `/auth` to use `AuthLayoutComponent` with child routes.
- `src/app/app.config.ts` - Register `authInterceptor` alongside the existing `errorInterceptor`.

### Notes

- Use `pnpm` as the package manager — never `npm` or `yarn`.
- All components must be standalone with `ChangeDetectionStrategy.OnPush`.
- Use Angular's functional interceptor (`HttpInterceptorFn`) and functional guard (`CanActivateFn`) patterns.
- Use `inject()` inside guards and interceptors to access services.
- Use Reactive Forms only — no template-driven forms.
- Semantic color tokens only — no hardcoded Tailwind color utilities (e.g., use `bg-primary`, not `bg-blue-500`).
- JWT decoding must use `atob()` — no third-party library.
- Run `ng serve` after completing all tasks to verify the auth flow works end-to-end.

---

## Tasks

- [x] 1.0 Auth Layout (Split-Screen Shell)
  - [x] 1.1 Create `AuthLayoutComponent`
    - Create `src/app/features/auth/auth-layout/auth-layout.component.ts`.
    - Make it a standalone component with `ChangeDetectionStrategy.OnPush`.
    - Import `RouterOutlet` in the `imports` array.
    - Template structure:
      ```html
      <div class="flex min-h-screen">
        <!-- Left: form slot -->
        <div class="flex flex-1 items-center justify-center p-8">
          <router-outlet></router-outlet>
        </div>
        <!-- Right: brand panel (hidden on mobile) -->
        <div class="hidden lg:flex flex-1 flex-col items-center justify-center bg-primary text-white p-12">
          <h1 class="text-3xl font-bold">Strenik Dashboard</h1>
          <p class="mt-4 text-lg opacity-80">Enterprise Angular Template</p>
        </div>
      </div>
      ```
    - Use semantic color tokens only (`bg-primary`, `text-foreground`, etc.).
    - The right panel must be hidden below `lg` breakpoint (`hidden lg:flex`).

- [x] 2.0 Auth Pages — Login, Register, Forgot Password, Reset Password
  - [x] 2.1 Create `LoginComponent`
    - Create `src/app/features/auth/login/login.component.ts`.
    - Standalone, `OnPush`, imports: `ReactiveFormsModule`, `RouterLink`.
    - Build a `FormGroup` with fields: `email` (required, email validator), `password` (required, minLength 8).
    - Template includes:
      - Page heading: "Sign in to your account"
      - Email input bound to `email` control with inline error messages.
      - Password input bound to `password` control with inline error messages.
      - Submit button — shows "Signing in..." and disabled state when `isLoading` signal is `true`.
      - Link to `/auth/register` ("Don't have an account? Register")
      - Link to `/auth/forgot-password` ("Forgot your password?")
    - On submit: call `AuthService.login()`, set `isLoading = true` before the call, set `isLoading = false` in `finalize()`.
    - On success: navigate to `/dashboard`.
    - On error: display a generic error message below the form.
  - [x] 2.2 Create `RegisterComponent`
    - Create `src/app/features/auth/register/register.component.ts`.
    - Standalone, `OnPush`, imports: `ReactiveFormsModule`, `RouterLink`.
    - Build a `FormGroup` with fields: `name` (required), `email` (required, email), `password` (required, minLength 8), `confirmPassword` (required).
    - Add a cross-field validator to check `password === confirmPassword`; show error "Passwords do not match" on the `confirmPassword` field.
    - Template includes:
      - Page heading: "Create an account"
      - All four fields with inline error messages.
      - Submit button with loading state.
      - Link to `/auth/login` ("Already have an account? Sign in")
    - On submit: call `AuthService.register()`, navigate to `/auth/login` on success.
  - [x] 2.3 Create `ForgotPasswordComponent`
    - Create `src/app/features/auth/forgot-password/forgot-password.component.ts`.
    - Standalone, `OnPush`, imports: `ReactiveFormsModule`, `RouterLink`.
    - Build a `FormGroup` with field: `email` (required, email).
    - Template includes:
      - Page heading: "Forgot your password?"
      - Brief instruction text.
      - Email field with inline error.
      - Submit button with loading state.
      - Link back to `/auth/login`.
    - On submit: call `AuthService.forgotPassword()`. On success, show a confirmation message: "Check your inbox for a reset link."
  - [x] 2.4 Create `ResetPasswordComponent`
    - Create `src/app/features/auth/reset-password/reset-password.component.ts`.
    - Standalone, `OnPush`, imports: `ReactiveFormsModule`, `RouterLink`.
    - Read the reset `token` from the query param `?token=xxx` using `ActivatedRoute`.
    - Build a `FormGroup` with fields: `password` (required, minLength 8), `confirmPassword` (required).
    - Add cross-field validator for password match (same as register).
    - Template includes:
      - Page heading: "Set a new password"
      - Both password fields with inline errors.
      - Submit button with loading state.
    - On submit: call `AuthService.resetPassword(token, password)`. On success, navigate to `/auth/login`.

- [x] 3.0 Auth Service & Models
  - [x] 3.1 Create `AuthUser` interface
    - Create `src/app/core/auth/auth.models.ts`.
    - Export the following interface:
      ```ts
      export interface AuthUser {
        id: string;
        name: string;
        email: string;
        role: string;
        exp: number;
      }
      ```
  - [x] 3.2 Create `AuthService`
    - Create `src/app/core/auth/auth.service.ts` with `providedIn: 'root'`.
    - Inject `HttpClient` and `Router`.
    - Define a private constant `TOKEN_KEY = 'auth_token'`.
    - Implement the following methods:
      - `login(email: string, password: string): Observable<void>`
        - POST to `${environment.apiUrl}/auth/login`.
        - Expect a response of `{ token: string }`.
        - Store the token: `localStorage.setItem(TOKEN_KEY, token)`.
        - Return `EMPTY` or map to `void`.
      - `register(name: string, email: string, password: string): Observable<void>`
        - POST to `${environment.apiUrl}/auth/register`.
        - Return `Observable<void>`.
      - `forgotPassword(email: string): Observable<void>`
        - POST to `${environment.apiUrl}/auth/forgot-password`.
        - Return `Observable<void>`.
      - `resetPassword(token: string, password: string): Observable<void>`
        - POST to `${environment.apiUrl}/auth/reset-password`.
        - Return `Observable<void>`.
      - `logout(): void`
        - `localStorage.removeItem(TOKEN_KEY)`.
        - `this.router.navigate(['/auth/login'])`.
      - `getToken(): string | null`
        - Return `localStorage.getItem(TOKEN_KEY)`.
      - `decodeToken(): AuthUser | null`
        - Get token via `getToken()`. If null, return null.
        - Split token by `.`, take index 1 (payload), decode with `atob()`, parse with `JSON.parse()`.
        - Return the parsed object as `AuthUser`.
        - Wrap in try/catch — return null on any error.
      - `isAuthenticated(): boolean`
        - Call `decodeToken()`. If null, return false.
        - Return `decoded.exp * 1000 > Date.now()`.
      - `getCurrentUser(): AuthUser | null`
        - Return `decodeToken()`.
      - `hasRole(roles: string[]): boolean`
        - Call `decodeToken()`. If null, return false.
        - Return `roles.includes(decoded.role)`.

- [x] 4.0 HTTP Interceptors
  - [x] 4.1 Create `authInterceptor`
    - Create `src/app/core/interceptors/auth.interceptor.ts`.
    - Define and export a functional `HttpInterceptorFn` named `authInterceptor`.
    - Inject `AuthService` using `inject(AuthService)`.
    - Get the token via `authService.getToken()`.
    - If token exists, clone the request and add the header:
      ```ts
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      ```
    - Forward the (possibly cloned) request via `next(req)`.
    - Pipe the result with `catchError`: if `error instanceof HttpErrorResponse && error.status === 401`, call `authService.logout()` then rethrow.
  - [x] 4.2 Register `authInterceptor` in `app.config.ts`
    - Open `src/app/app.config.ts`.
    - Add `authInterceptor` to the `withInterceptors([...])` array alongside `errorInterceptor`.
    - Import `authInterceptor` from its file.

- [x] 5.0 Auth Guard Update
  - [x] 5.1 Update `authGuard` to use `AuthService`
    - Open `src/app/core/guards/auth.guard.ts`.
    - Inject `AuthService` via `inject(AuthService)` and `Router` via `inject(Router)`.
    - Replace the `return true` stub with:
      ```ts
      if (authService.isAuthenticated()) return true;
      return router.createUrlTree(['/auth/login']);
      ```

- [x] 6.0 `*hasPermission` Structural Directive
  - [x] 6.1 Create `HasPermissionDirective`
    - Create `src/app/shared/directives/has-permission.directive.ts`.
    - Define a standalone structural directive:
      ```ts
      @Directive({ selector: '[hasPermission]', standalone: true })
      export class HasPermissionDirective implements OnInit {
        @Input() hasPermission: string[] = [];
        ...
      }
      ```
    - Inject `TemplateRef`, `ViewContainerRef`, and `AuthService`.
    - In `ngOnInit`: call `authService.hasRole(this.hasPermission)`.
      - If `true`: `this.vcr.createEmbeddedView(this.templateRef)`.
      - If `false`: `this.vcr.clear()`.
    - The directive removes the element from the DOM when the user lacks the required role (mirrors `*ngIf` behavior).

- [x] 7.0 Routing — Wire Auth Layout with Child Routes
  - [x] 7.1 Create `auth.routes.ts`
    - Create `src/app/features/auth/auth.routes.ts`.
    - Define and export a `Routes` array:
      ```ts
      export const AUTH_ROUTES: Routes = [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
        { path: 'forgot-password', component: ForgotPasswordComponent },
        { path: 'reset-password', component: ResetPasswordComponent },
      ];
      ```
    - Import each component directly (no lazy loading needed within the auth feature).
  - [x] 7.2 Update `app.routes.ts`
    - Open `src/app/app.routes.ts`.
    - Replace the existing `/auth` placeholder route with:
      ```ts
      {
        path: 'auth',
        loadComponent: () =>
          import('./features/auth/auth-layout/auth-layout.component')
            .then(m => m.AuthLayoutComponent),
        loadChildren: () =>
          import('./features/auth/auth.routes')
            .then(m => m.AUTH_ROUTES),
      }
      ```
    - Remove the old `AuthComponent` import and placeholder file (`src/app/features/auth/auth.component.ts`) if it exists.
