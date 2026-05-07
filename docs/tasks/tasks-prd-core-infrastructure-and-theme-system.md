## Relevant Files

- `src/app/app.config.ts` - Global application providers: router, HTTP client with interceptors, animations.
- `src/app/app.component.ts` - Minimal shell component rendering `<router-outlet>`.
- `src/app/app.routes.ts` - Root route definitions with lazy-loaded feature stubs and auth guard.
- `src/app/core/guards/auth.guard.ts` - Functional auth guard (`CanActivateFn`), returns `true` as placeholder.
- `src/app/core/interceptors/error.interceptor.ts` - Functional HTTP error interceptor that logs and rethrows errors.
- `src/app/core/api/base-api.service.ts` - Abstract typed API base service with `get`, `post`, `put`, `patch`, `delete` methods.
- `src/app/features/dashboard/dashboard.component.ts` - Placeholder component for `/dashboard` route.
- `src/app/features/auth/auth.component.ts` - Placeholder component for `/auth` route.
- `src/app/features/users/users.component.ts` - Placeholder component for `/users` route.
- `src/app/features/products/products.component.ts` - Placeholder component for `/products` route.
- `src/app/features/settings/settings.component.ts` - Placeholder component for `/settings` route.
- `src/app/features/profile/profile.component.ts` - Placeholder component for `/profile` route.
- `src/app/features/not-found/not-found.component.ts` - 404 page component for `**` wildcard route.
- `src/environments/environment.interface.ts` - Typed `Environment` interface shared by both env files.
- `src/environments/environment.ts` - Development environment configuration.
- `src/environments/environment.prod.ts` - Production environment configuration.
- `src/styles/themes.css` - CSS custom properties for light and dark themes.
- `tailwind.config.js` - Tailwind config mapping CSS variables to semantic utility classes.
- `tsconfig.json` - TypeScript strict mode configuration.
- `angular.json` - Build configuration with `fileReplacements` for environment files.

### Notes

- Use `pnpm` as the package manager — never `npm` or `yarn`.
- All components must be standalone (no `NgModule`).
- Default change detection is `OnPush` for all components.
- Use Angular's functional interceptor pattern (`HttpInterceptorFn`) — not class-based.
- Use Angular's functional guard pattern (`CanActivateFn`) — not class-based.
- Run `ng serve` after completing all tasks to verify the app boots cleanly.

---

## Tasks

- [ ] 1.0 Bootstrap Angular Application
  - [ ] 1.1 Enable strict TypeScript mode
    - Open `tsconfig.json` and confirm `"strict": true` is set under `compilerOptions`.
    - If missing, add it. This enables `strictNullChecks`, `noImplicitAny`, and other strict checks.
  - [ ] 1.2 Configure `app.config.ts` with global providers
    - Open `src/app/app.config.ts`.
    - Register the following providers:
      - `provideRouter(routes)` — import `routes` from `app.routes.ts`
      - `provideHttpClient(withInterceptors([errorInterceptor]))` — wire up the error interceptor (created in task 5)
      - `provideAnimations()`
    - Import the necessary Angular provider functions from `@angular/core`, `@angular/router`, `@angular/common/http`, and `@angular/platform-browser/animations`.
    - Note: Add the interceptor reference after task 5 is complete; use an empty array `[]` for `withInterceptors` for now.
  - [ ] 1.3 Simplify `app.component.ts` to a minimal shell
    - Open `src/app/app.component.ts`.
    - Make it a standalone component with `changeDetection: ChangeDetectionStrategy.OnPush`.
    - The template must contain only `<router-outlet></router-outlet>`.
    - Import `RouterOutlet` in the `imports` array of the component decorator.
    - Remove any default boilerplate (title property, inline styles, etc.).

- [ ] 2.0 Define Routing Shell with Lazy-Loaded Feature Stubs & Auth Guard
  - [ ] 2.1 Create minimal placeholder components for each feature
    - For each of the following paths, create a standalone `OnPush` component with a simple template (e.g., `<p>Dashboard</p>`):
      - `src/app/features/dashboard/dashboard.component.ts`
      - `src/app/features/auth/auth.component.ts`
      - `src/app/features/users/users.component.ts`
      - `src/app/features/products/products.component.ts`
      - `src/app/features/settings/settings.component.ts`
      - `src/app/features/profile/profile.component.ts`
      - `src/app/features/not-found/not-found.component.ts` (template: `<p>404 - Page Not Found</p>`)
    - Each component must use `ChangeDetectionStrategy.OnPush` and be marked `standalone: true`.
  - [ ] 2.2 Create functional `authGuard`
    - Create the file `src/app/core/guards/auth.guard.ts`.
    - Define and export a `CanActivateFn` named `authGuard` using `inject` and the functional pattern.
    - For now, the guard must simply return `true` — the real logic comes in the Authentication PRD.
    - Example skeleton:
      ```ts
      import { CanActivateFn } from '@angular/router';
      export const authGuard: CanActivateFn = () => true;
      ```
  - [ ] 2.3 Define `app.routes.ts` with all route entries
    - Open `src/app/app.routes.ts` and define the `Routes` array with the following entries:
      - `{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }`
      - `{ path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] }`
      - `{ path: 'auth', loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent) }`
      - `{ path: 'users', loadComponent: ..., canActivate: [authGuard] }` — same pattern for `users`, `products`, `settings`, `profile`
      - `{ path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent) }`
    - Apply `authGuard` to all routes except `/auth` and the wildcard `**`.

- [ ] 3.0 Set Up Environment Configuration
  - [ ] 3.1 Create the `Environment` interface
    - Create `src/environments/environment.interface.ts`.
    - Export a TypeScript interface named `Environment` with at minimum:
      ```ts
      export interface Environment {
        production: boolean;
        apiUrl: string;
        appName: string;
      }
      ```
    - Both environment files must import and use this interface.
  - [ ] 3.2 Create the development environment file
    - Create `src/environments/environment.ts`.
    - Export a constant `environment` typed as `Environment`:
      ```ts
      import { Environment } from './environment.interface';
      export const environment: Environment = {
        production: false,
        apiUrl: 'http://localhost:3000',
        appName: 'Strenik Dashboard',
      };
      ```
  - [ ] 3.3 Create the production environment file
    - Create `src/environments/environment.prod.ts`.
    - Export a constant `environment` typed as `Environment`:
      ```ts
      import { Environment } from './environment.interface';
      export const environment: Environment = {
        production: true,
        apiUrl: 'https://api.strenik.com',
        appName: 'Strenik Dashboard',
      };
      ```
  - [ ] 3.4 Configure `angular.json` for environment file replacement at build time
    - Open `angular.json`.
    - Under `projects > <app-name> > architect > build > configurations > production`, add a `fileReplacements` entry:
      ```json
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ]
      ```
    - This ensures the production build automatically swaps the dev environment for the prod one.

- [ ] 4.0 Implement Typed API Base Service
  - [ ] 4.1 Create the `core/api/` directory and base service file
    - Create `src/app/core/api/base-api.service.ts`.
    - Declare it as an `abstract` class — it must NOT be decorated with `@Injectable` directly (concrete subclasses will be `providedIn: 'root'`).
    - Inject Angular's `HttpClient` using `inject(HttpClient)` inside the class body (preferred over constructor injection in newer Angular).
  - [ ] 4.2 Implement all typed HTTP methods on `BaseApiService`
    - Import `environment` from the environment file to get `apiUrl`.
    - Implement the following `protected` methods, each constructing the full URL via `environment.apiUrl + path`:
      ```ts
      protected get<T>(path: string, params?: HttpParams): Observable<T>
      protected post<T>(path: string, body: unknown): Observable<T>
      protected put<T>(path: string, body: unknown): Observable<T>
      protected patch<T>(path: string, body: unknown): Observable<T>
      protected delete<T>(path: string): Observable<T>
      ```
    - Each method delegates to the injected `HttpClient` method (e.g., `this.http.get<T>(url, { params })`).
    - The class must contain NO business logic — infrastructure only.

- [ ] 5.0 Implement Global HTTP Error Interceptor
  - [ ] 5.1 Create the functional error interceptor
    - Create `src/app/core/interceptors/error.interceptor.ts`.
    - Define and export an `HttpInterceptorFn` named `errorInterceptor`:
      ```ts
      import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
      import { catchError, throwError } from 'rxjs';

      export const errorInterceptor: HttpInterceptorFn = (req, next) =>
        next(req).pipe(
          catchError((error: HttpErrorResponse) => {
            console.error(`HTTP Error ${error.status}: ${error.message}`);
            return throwError(() => error);
          })
        );
      ```
    - The interceptor must NOT show any UI notifications at this stage — console logging only.
  - [ ] 5.2 Register the interceptor in `app.config.ts`
    - Open `src/app/app.config.ts`.
    - Import `errorInterceptor` from `core/interceptors/error.interceptor.ts`.
    - Pass it to `withInterceptors([errorInterceptor])` inside `provideHttpClient(...)`.

- [ ] 6.0 Establish CSS Variables & Tailwind Semantic Color Token System
  - [ ] 6.1 Create `src/styles/themes.css` with light theme CSS variables
    - Create the file `src/styles/themes.css`.
    - Define all required CSS custom properties on `:root`:
      ```css
      :root {
        --color-primary: #2563eb;
        --color-primary-foreground: #ffffff;
        --color-secondary: #64748b;
        --color-secondary-foreground: #ffffff;
        --color-background: #ffffff;
        --color-foreground: #0f172a;
        --color-surface: #f8fafc;
        --color-surface-foreground: #0f172a;
        --color-border: #e2e8f0;
        --color-muted: #f1f5f9;
        --color-muted-foreground: #64748b;
        --color-danger: #dc2626;
        --color-danger-foreground: #ffffff;
        --color-success: #16a34a;
        --color-success-foreground: #ffffff;
        --color-warning: #d97706;
        --color-warning-foreground: #ffffff;
        --color-info: #0284c7;
        --color-info-foreground: #ffffff;
      }
      ```
    - Make sure `themes.css` is imported in `src/styles.css` (or included in the `styles` array in `angular.json`).
  - [ ] 6.2 Add `.dark` class overrides for dark theme
    - In the same `src/styles/themes.css` file, add a `.dark` selector block that overrides the variables with dark-mode values:
      ```css
      .dark {
        --color-primary: #3b82f6;
        --color-primary-foreground: #ffffff;
        --color-secondary: #94a3b8;
        --color-secondary-foreground: #0f172a;
        --color-background: #0f172a;
        --color-foreground: #f8fafc;
        --color-surface: #1e293b;
        --color-surface-foreground: #f8fafc;
        --color-border: #334155;
        --color-muted: #1e293b;
        --color-muted-foreground: #94a3b8;
        --color-danger: #ef4444;
        --color-danger-foreground: #ffffff;
        --color-success: #22c55e;
        --color-success-foreground: #ffffff;
        --color-warning: #f59e0b;
        --color-warning-foreground: #ffffff;
        --color-info: #38bdf8;
        --color-info-foreground: #0f172a;
      }
      ```
    - The `.dark` class is applied to the `<html>` element to activate dark mode.
  - [ ] 6.3 Configure `tailwind.config.js` to map CSS variables to semantic utility classes
    - Open `tailwind.config.js`.
    - Extend the `colors` section in `theme.extend` to map each CSS variable:
      ```js
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: 'var(--color-primary)',
              foreground: 'var(--color-primary-foreground)',
            },
            secondary: {
              DEFAULT: 'var(--color-secondary)',
              foreground: 'var(--color-secondary-foreground)',
            },
            background: 'var(--color-background)',
            foreground: 'var(--color-foreground)',
            surface: {
              DEFAULT: 'var(--color-surface)',
              foreground: 'var(--color-surface-foreground)',
            },
            border: 'var(--color-border)',
            muted: {
              DEFAULT: 'var(--color-muted)',
              foreground: 'var(--color-muted-foreground)',
            },
            danger: {
              DEFAULT: 'var(--color-danger)',
              foreground: 'var(--color-danger-foreground)',
            },
            success: {
              DEFAULT: 'var(--color-success)',
              foreground: 'var(--color-success-foreground)',
            },
            warning: {
              DEFAULT: 'var(--color-warning)',
              foreground: 'var(--color-warning-foreground)',
            },
            info: {
              DEFAULT: 'var(--color-info)',
              foreground: 'var(--color-info-foreground)',
            },
          },
        },
      },
      ```
    - After this, developers can use `bg-primary`, `text-danger`, `border-border`, `bg-surface`, etc. in component templates.
    - Hardcoded Tailwind color utilities (e.g., `bg-blue-500`, `text-red-400`) must NOT be used anywhere in the project.
