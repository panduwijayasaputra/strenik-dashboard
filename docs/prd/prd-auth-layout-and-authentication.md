# PRD: Auth Layout & Authentication

## 1. Introduction / Overview

This PRD covers the authentication system and its dedicated layout for the Strenik Dashboard. It provides the four standard auth pages (login, register, forgot password, reset password), the JWT-based auth service, a token-aware HTTP interceptor, route guards, and a `*hasPermission` structural directive for role-based UI visibility.

This module sits between the Core Infrastructure (already complete) and the Admin Layout (next PRD). All protected routes depend on the auth guard defined here.

---

## 2. Goals

1. Deliver a split-screen auth layout reusable across all four auth pages.
2. Implement JWT login with `localStorage` persistence and logout on 401.
3. Decode role/permissions from the JWT payload and expose them via an `AuthService`.
4. Protect non-auth routes with a functional `authGuard`.
5. Provide a `*hasPermission` structural directive that accepts an array of allowed roles.

---

## 3. User Stories

- As a **guest**, I want to log in with email and password so I can access the dashboard.
- As a **guest**, I want to register an account so I can get started.
- As a **guest**, I want to request a password reset link so I can recover my account.
- As a **guest**, I want to set a new password via a reset link so I can regain access.
- As a **developer**, I want the auth guard to redirect unauthenticated users to `/auth/login` so protected pages stay secure.
- As a **developer**, I want a `*hasPermission` directive so I can hide UI elements based on the user's role without writing custom logic each time.

---

## 4. Functional Requirements

### 4.1 Auth Layout

1. The auth layout must be a standalone Angular component (`AuthLayoutComponent`) that wraps all four auth pages.
2. The layout must use a **split-screen** design:
   - **Left panel:** the form (login, register, etc.)
   - **Right panel:** brand area — app name, tagline, decorative background using semantic color tokens
3. The layout must be fully responsive — on mobile, the right panel collapses and only the form is shown.
4. The auth layout must be registered as the parent route for `/auth/*` in `app.routes.ts`.

### 4.2 Auth Pages

5. Four page components must be created under `src/app/features/auth/`:
   - `login/login.component.ts` — email + password fields, submit button, links to register and forgot password
   - `register/register.component.ts` — name, email, password, confirm password fields, submit button, link to login
   - `forgot-password/forgot-password.component.ts` — email field, submit button, link back to login
   - `reset-password/reset-password.component.ts` — new password + confirm password fields, submit button
6. All forms must use **Reactive Forms** with basic validation (required, email format, min password length of 8, password match).
7. Validation error messages must display inline beneath each field.
8. All pages must show a loading state on the submit button while a request is in flight.
9. All page components must be standalone with `OnPush` change detection.

### 4.3 Auth Service

10. Create `src/app/core/auth/auth.service.ts` as an injectable service.
11. The service must expose the following methods:
    - `login(email, password)` — POST to `environment.apiUrl + '/auth/login'`, store the returned JWT in `localStorage` under the key `auth_token`, return `Observable<void>`.
    - `register(name, email, password)` — POST to `/auth/register`, return `Observable<void>`.
    - `forgotPassword(email)` — POST to `/auth/forgot-password`, return `Observable<void>`.
    - `resetPassword(token, password)` — POST to `/auth/reset-password`, return `Observable<void>`.
    - `logout()` — remove `auth_token` from `localStorage`, redirect to `/auth/login`.
    - `getToken()` — return the raw JWT string from `localStorage` or `null`.
    - `isAuthenticated()` — return `true` if a valid, non-expired token exists.
    - `getCurrentUser()` — decode the JWT payload and return it typed as `AuthUser`.
    - `hasRole(roles: string[])` — return `true` if the decoded JWT's role field matches any of the provided roles.
12. The `AuthUser` interface must be defined in `src/app/core/auth/auth.models.ts`:
    ```ts
    export interface AuthUser {
      id: string;
      name: string;
      email: string;
      role: string;
    }
    ```
13. JWT decoding must be done manually (parse the Base64 payload) — no external JWT library required.
14. Token expiry must be checked by comparing `payload.exp * 1000` against `Date.now()`.

### 4.4 Auth Interceptor

15. Create `src/app/core/interceptors/auth.interceptor.ts` as a functional `HttpInterceptorFn`.
16. The interceptor must attach the JWT as a `Bearer` token to every outgoing request:
    ```
    Authorization: Bearer <token>
    ```
17. If no token exists, the request must be forwarded unmodified.
18. On a `401` response, the interceptor must call `AuthService.logout()`.
19. Register this interceptor in `app.config.ts` alongside the existing error interceptor.

### 4.5 Auth Guard (update)

20. Update `src/app/core/guards/auth.guard.ts` to use `AuthService.isAuthenticated()`.
21. If authenticated, allow navigation. If not, redirect to `/auth/login`.

### 4.6 `*hasPermission` Directive

22. Create `src/app/shared/directives/has-permission.directive.ts`.
23. The directive must be a structural directive that accepts an array of role strings:
    ```html
    <button *hasPermission="['admin', 'editor']">Delete</button>
    ```
24. If the current user's role is in the provided array, render the element. Otherwise, remove it from the DOM (same behavior as `*ngIf="false"`).
25. The directive must be standalone and importable individually.

### 4.7 Routing

26. Update `app.routes.ts` so `/auth` lazy-loads the `AuthLayoutComponent` as a parent, with child routes:
    - `login` → `LoginComponent`
    - `register` → `RegisterComponent`
    - `forgot-password` → `ForgotPasswordComponent`
    - `reset-password` → `ResetPasswordComponent`
    - `''` → redirects to `login`
27. Replace the previous `/auth` placeholder route entirely.

---

## 5. Non-Goals (Out of Scope)

- OAuth / social login (Google, GitHub, etc.)
- Two-factor authentication (2FA)
- Email verification flow
- Real backend — all API calls use the typed base service against `environment.apiUrl`; no mock server
- Token refresh / silent renew (logout on 401 is sufficient for this template)
- Per-permission granularity (only role-based, e.g., `admin`, `user`)

---

## 6. Design Considerations

- Use semantic color tokens only — `bg-surface`, `text-primary`, `border-border`, etc. No hardcoded Tailwind color utilities.
- The right brand panel background should use `bg-primary` with white text to demonstrate the theme system.
- Form inputs must follow the same pattern that the Form Components PRD will formalize — use plain Reactive Forms + Tailwind styling for now.
- The split-screen layout should look balanced at 1280px and gracefully collapse below 768px.

---

## 7. Technical Considerations

- Angular's functional interceptor pattern (`HttpInterceptorFn`) must be used — no class-based interceptors.
- Angular's functional guard pattern (`CanActivateFn`) must be used.
- Use `inject()` inside functional interceptors and guards to access services.
- The `AuthService` must be provided in `root` (`providedIn: 'root'`).
- Do not use `jwtDecode` or any third-party library — implement Base64 decoding with `atob()`.

---

## 8. Success Metrics

- A user can complete the login flow and be redirected to `/dashboard`.
- An unauthenticated user visiting `/dashboard` is redirected to `/auth/login`.
- An element wrapped with `*hasPermission="['admin']"` is hidden for a `user`-role token and visible for an `admin`-role token.
- All four auth pages render correctly in both light and dark themes.

---

## 9. Open Questions

- Should the register page be shown in the final app or hidden via config? (The template includes it; consuming projects can remove it.)
- Should `reset-password` read the token from a query param (`?token=xxx`) or a route param (`/reset-password/:token`)? Defaulting to query param.
