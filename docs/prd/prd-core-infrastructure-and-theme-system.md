# PRD: Core Infrastructure & Theme System (CSS Foundation)

## 1. Introduction / Overview

This PRD covers the foundational setup of the Strenik Dashboard Angular application. It establishes everything needed before any feature can be built: the app bootstrap configuration, routing shell, environment setup, HTTP error handling, a typed API base class, and the CSS variable / Tailwind semantic color token system that powers the entire theme architecture.

Without this foundation in place, no other module can be developed correctly. The goal is to produce a clean, well-structured Angular project skeleton that all future PRDs build on top of.

---

## 2. Goals

1. Bootstrap a working Angular application using standalone components and strict TypeScript.
2. Define a routing shell that supports lazy-loaded feature modules, auth guards, redirects, and a 404 fallback.
3. Create environment files for `development` and `production` that are structured for easy extension.
4. Implement a reusable, typed API base class that all future feature services extend.
5. Implement a global HTTP error interceptor that catches errors and logs them.
6. Establish the CSS variable foundation and Tailwind semantic color token system so every future component is themeable from day one.

---

## 3. User Stories

- As a **developer**, I want a clean Angular project skeleton so I can start building features without setting up boilerplate from scratch.
- As a **developer**, I want a typed API base class so every feature service follows the same pattern and I don't duplicate HTTP logic.
- As a **developer**, I want environment config structured in one place so switching between dev and prod requires no code changes.
- As a **developer**, I want all HTTP errors caught globally so I don't have to handle network failures in every individual service.
- As a **developer**, I want semantic CSS color tokens set up so every component I build automatically supports theming without using hardcoded Tailwind color utilities.

---

## 4. Functional Requirements

### 4.1 App Bootstrap

1. The app must use Angular standalone components — no `NgModule` unless required by a third-party library.
2. `app.config.ts` must register: `provideRouter`, `provideHttpClient` (with interceptors support), `provideAnimations`, and any other global providers.
3. `app.component.ts` must be a minimal shell that renders `<router-outlet>`.
4. Strict TypeScript mode must be enabled in `tsconfig.json`.
5. Angular's `OnPush` change detection should be the default for all generated components.

### 4.2 Routing Shell

6. The root router must be defined in `app.routes.ts`.
7. The following route stubs must be defined as lazy-loaded placeholders:
   - `/` → redirects to `/dashboard`
   - `/dashboard` → lazy loads `features/dashboard`
   - `/auth` → lazy loads `features/auth`
   - `/users` → lazy loads `features/users`
   - `/products` → lazy loads `features/products`
   - `/settings` → lazy loads `features/settings`
   - `/profile` → lazy loads `features/profile`
   - `**` → redirects to a `404` error page
8. An `authGuard` (functional guard) must be created that checks whether the user is authenticated. For now, it may return `true` always — the logic will be completed in the Authentication PRD. The guard must be attached to all protected routes.
9. A redirect must exist so that unauthenticated users (when the guard is fully implemented) are sent to `/auth/login`.
10. A redirect must exist so that already-authenticated users visiting `/auth` are sent to `/dashboard`.

### 4.3 Environment Configuration

11. Two environment files must be created:
    - `src/environments/environment.ts` (development)
    - `src/environments/environment.prod.ts` (production)
12. Each environment file must export a typed `Environment` interface (defined once and imported by both files) containing at minimum:
    - `production: boolean`
    - `apiUrl: string`
    - `appName: string`
13. The structure must allow additional keys to be added later without breaking existing code.
14. `angular.json` must be configured to swap the environment file at build time using `fileReplacements`.

### 4.4 API Base Service

15. An abstract `BaseApiService` class must be created at `src/app/core/api/base-api.service.ts`.
16. It must inject Angular's `HttpClient`.
17. It must expose the following typed protected methods for subclasses to use:
    - `get<T>(path: string, params?: HttpParams): Observable<T>`
    - `post<T>(path: string, body: unknown): Observable<T>`
    - `put<T>(path: string, body: unknown): Observable<T>`
    - `patch<T>(path: string, body: unknown): Observable<T>`
    - `delete<T>(path: string): Observable<T>`
18. All methods must construct the full URL by prepending the `apiUrl` from the environment config.
19. The class must NOT contain any business logic — it is infrastructure only.

### 4.5 HTTP Error Interceptor

20. A functional HTTP interceptor must be created at `src/app/core/interceptors/error.interceptor.ts`.
21. It must intercept all outgoing HTTP requests.
22. On any `HttpErrorResponse`, it must:
    - Log the error to the console (`console.error`) with the status code and message.
    - Rethrow the error using `throwError(() => error)` so individual services can still handle it if needed.
23. The interceptor must be registered globally in `app.config.ts`.
24. It must NOT show any UI notifications at this stage.

### 4.6 CSS Variables & Tailwind Semantic Color Tokens

25. A global CSS file (`src/styles/themes.css` or included in `src/styles.css`) must define a set of CSS custom properties (variables) for the default color theme.
26. The minimum required CSS variables are:

    ```css
    --color-primary
    --color-primary-foreground
    --color-secondary
    --color-secondary-foreground
    --color-background
    --color-foreground
    --color-surface
    --color-surface-foreground
    --color-border
    --color-muted
    --color-muted-foreground
    --color-danger
    --color-danger-foreground
    --color-success
    --color-success-foreground
    --color-warning
    --color-warning-foreground
    --color-info
    --color-info-foreground
    ```

27. These variables must be defined on `:root` for the default (light) theme.
28. A `.dark` class on the `<html>` element must override these variables with dark-mode values.
29. `tailwind.config.js` must map these CSS variables to Tailwind semantic utility classes so developers can write `bg-primary`, `text-danger`, `border-border`, etc.
30. Hardcoded Tailwind color utilities (e.g., `bg-blue-500`, `text-red-400`) must NOT be used anywhere in the project.

---

## 5. Non-Goals (Out of Scope)

- Auth interceptor (JWT token injection, refresh token logic) — covered in the Authentication PRD.
- Theme switcher UI component — covered in a later PRD.
- Light/dark mode toggle logic — covered in the Theme System PRD.
- Multiple color theme variants (emerald, violet, etc.) — covered in the Theme System PRD.
- Any real feature pages (dashboard, users, products, etc.) — covered in their respective PRDs.
- ngx-toastr integration for error notifications — the error interceptor only logs to console at this stage.

---

## 6. Design Considerations

- All styling must use the semantic Tailwind utilities defined in requirement 29. No hardcoded colors.
- The folder structure must follow the architecture defined in the project guidelines:

  ```
  src/app/
    core/
      api/          ← BaseApiService lives here
      interceptors/ ← error.interceptor.ts lives here
      guards/       ← auth.guard.ts lives here
    features/       ← lazy-loaded route stubs live here
  src/environments/ ← environment files live here
  src/styles/       ← CSS variable definitions live here
  ```

---

## 7. Technical Considerations

- Use Angular's functional interceptor pattern (`HttpInterceptorFn`) — not the class-based `HttpInterceptor` interface, which is deprecated in newer Angular versions.
- Use Angular's functional guard pattern (`CanActivateFn`) — not class-based guards.
- `provideHttpClient(withInterceptors([errorInterceptor]))` should be used in `app.config.ts`.
- The `BaseApiService` should be `providedIn: 'root'` indirectly — concrete subclasses will be root-provided.
- Do not use `APP_INITIALIZER` at this stage unless bootstrapping genuinely requires it.
- pnpm is the required package manager — do not use npm or yarn.

---

## 8. Success Metrics

- `ng serve` runs without errors or warnings on a fresh install.
- Navigating to `/` redirects to `/dashboard`.
- Navigating to an unknown path redirects to the 404 page.
- All lazy-loaded feature routes resolve without errors (even if they show a blank component).
- A feature service that extends `BaseApiService` can call `this.get<User[]>('/users')` and the correct full URL is constructed.
- Any HTTP error triggers a `console.error` log with the status code.
- Writing `class="bg-primary text-foreground"` in any component renders the correct color from the CSS variables.
- The `.dark` class on `<html>` swaps all semantic colors to their dark-mode values.

---

## 9. Open Questions

- Should `apiUrl` in the development environment point to `http://localhost:3000` or a placeholder like `https://api.dev.strenik.com`?
- Should the 404 page live inside `core/` or `features/`?
- Should `BaseApiService` handle query param serialization, or leave that to the caller via `HttpParams`?
- Is there a preferred CSS variable naming convention — `--color-primary` vs `--primary` vs `--clr-primary`?
