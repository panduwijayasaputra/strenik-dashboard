# Strenik Dashboard — Project Structure

> Actual folder layout for this Angular 19 standalone-component dashboard.

---

## Folder Map

```
src/
├── app/
│   │
│   ├── core/                          # App-wide singletons (loaded once)
│   │   ├── api/
│   │   │   └── base-api.service.ts    # Base HTTP service with typed responses
│   │   ├── auth/
│   │   │   └── auth.service.ts        # JWT auth, login, logout, role switching
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Route guard (redirects to /auth/login)
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts    # Attaches Bearer token to requests
│   │   │   └── error.interceptor.ts   # Global HTTP error handling
│   │   ├── services/
│   │   │   ├── breadcrumb.service.ts  # Auto-generates breadcrumbs from routes
│   │   │   ├── layout.service.ts      # Sidebar expand/collapse, mobile drawer
│   │   │   ├── notifications.service.ts
│   │   │   └── index.ts              # Barrel export
│   │   └── theme/
│   │       └── theme.service.ts       # Light/dark/system mode + palette switcher
│   │
│   ├── shared/                        # Reusable UI primitives (no business logic)
│   │   ├── directives/
│   │   │   └── has-permission.directive.ts  # *hasPermission structural directive
│   │   └── pipes/                     # Custom pipes (placeholder)
│   │
│   ├── layout/                        # Shell components — rendered once per session
│   │   ├── admin-layout/              # Root shell: sidebar + navbar + router-outlet
│   │   ├── sidebar/
│   │   │   ├── nav-item/              # Single nav link (with mini-mode tooltip)
│   │   │   └── nav-group/             # Collapsible group with children
│   │   ├── top-navbar/                # Search bar, theme switcher, notifications, profile
│   │   ├── breadcrumb/                # Auto-breadcrumb from route data.breadcrumb
│   │   ├── notifications/             # Notifications dropdown
│   │   ├── profile-dropdown/          # Avatar + user menu dropdown
│   │   ├── theme-switcher/            # Mode + palette picker panel
│   │   └── index.ts                   # Barrel export
│   │
│   ├── models/                        # Shared interfaces & type definitions
│   │   ├── auth.model.ts              # AuthUser interface
│   │   ├── nav-item.model.ts          # NavItem interface (label, icon, route, children)
│   │   ├── nav-items.config.ts        # App navigation tree (NAV_ITEMS constant)
│   │   └── index.ts                   # Barrel export
│   │
│   ├── features/                      # Domain features — lazy-loaded via router
│   │   │
│   │   ├── auth/                      # Authentication (public routes)
│   │   │   ├── auth-layout/           # Centered card shell for auth pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── auth.component.ts      # Auth root component
│   │   │   └── auth.routes.ts         # AUTH_ROUTES constant
│   │   │
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts # Overview page (stub)
│   │   │
│   │   ├── users/                     # Users feature
│   │   │   ├── user-list/
│   │   │   │   └── user-list.component.ts   # Routable list view
│   │   │   ├── users.service.ts       # Users API calls
│   │   │   └── users.model.ts         # User interface
│   │   │
│   │   ├── products/                  # Products feature
│   │   │   ├── product-list/
│   │   │   │   └── product-list.component.ts  # Routable list view
│   │   │   ├── products.service.ts    # Products API calls
│   │   │   └── products.model.ts      # Product interface
│   │   │
│   │   ├── settings/
│   │   │   └── settings.component.ts  # Settings page (stub)
│   │   │
│   │   ├── profile/
│   │   │   └── profile.component.ts   # Profile page (stub)
│   │   │
│   │   └── not-found/
│   │       └── not-found.component.ts # 404 catch-all
│   │
│   ├── app.ts                         # Root component
│   ├── app.routes.ts                  # Top-level route definitions
│   └── app.config.ts                  # Bootstrap providers
│
├── assets/
│   ├── images/                        # Static images
│   ├── icons/                         # SVG icon assets
│   └── i18n/                          # Translation JSON files (future)
│
├── environments/
│   ├── environment.ts                 # Development config
│   ├── environment.prod.ts            # Production config
│   └── environment.interface.ts       # Environment shape interface
│
└── styles/
    ├── themes.css                     # CSS variable palettes (light/dark/color themes)
    └── styles.css                     # Global base styles
```

---

## Architecture Layers

### `core/` — App-wide Singletons
Loaded once. Never imported directly by features — injected via DI.

- Auth, guards, interceptors, layout state, notifications, theme, base API service.
- Rule: features never import from `core/` directly — they consume services via injection.

### `shared/` — Reusable UI Primitives
Stateless, no business logic.

- Directives (e.g. `*hasPermission`) and pipes that any feature can use.
- Rule: no service calls inside shared components.

### `layout/` — Shell Components
Rendered once per authenticated session inside `AdminLayoutComponent`.

- Sidebar, navbar, breadcrumb, dropdowns.
- Consumes `core/services/` via injection.
- Barrel-exported from `layout/index.ts`.

### `models/` — Shared Type Contracts
Interfaces and config used across `core/`, `layout/`, and `features/`.

- Barrel-exported from `models/index.ts`.

### `features/` — Domain Features (Lazy-Loaded)

Each feature follows this internal pattern:

```
features/[feature]/
├── [view]/                      # One sub-folder per routable view or complex component
│   └── [view].component.ts
├── [feature].service.ts         # Feature-scoped API calls (providedIn: 'root' or feature)
└── [feature].model.ts           # Feature-specific interfaces
```

Examples:
- `users/user-list/user-list.component.ts` — the routable Users list page
- `users/users.service.ts` — UsersService for API calls
- `users/users.model.ts` — `User` interface

---

## Path Aliases (`tsconfig.json`)

```json
"paths": {
  "@core/*":     ["src/app/core/*"],
  "@shared/*":   ["src/app/shared/*"],
  "@features/*": ["src/app/features/*"],
  "@layout/*":   ["src/app/layout/*"],
  "@models/*":   ["src/app/models/*"],
  "@env/*":      ["src/environments/*"]
}
```

---

## Naming Conventions

| File type        | Convention                        | Example                        |
|------------------|-----------------------------------|--------------------------------|
| Component        | `[name].component.ts`             | `user-list.component.ts`       |
| Service          | `[name].service.ts`               | `users.service.ts`             |
| Guard            | `[name].guard.ts`                 | `auth.guard.ts`                |
| Interceptor      | `[name].interceptor.ts`           | `auth.interceptor.ts`          |
| Model/Interface  | `[name].model.ts`                 | `users.model.ts`               |
| Pipe             | `[name].pipe.ts`                  | `date-format.pipe.ts`          |
| Directive        | `[name].directive.ts`             | `has-permission.directive.ts`  |
| Route config     | `[name].routes.ts`                | `auth.routes.ts`               |
| Barrel           | `index.ts`                        | `layout/index.ts`              |

---

## Key Rules

| Rule | Reason |
|------|--------|
| All components are **standalone** | No NgModules; tree-shakeable |
| **OnPush** change detection everywhere | Performance |
| Use **Signals** for local state | Avoid RxJS boilerplate where unnecessary |
| Tailwind **semantic tokens** only (`bg-primary`, `text-danger`) | Theme-switchable at runtime |
| Never hardcode colors (`bg-blue-500`) | Breaks theme system |
| **No real API calls** — use mock/stub data | This project is a planning template |
| Features are **lazy-loaded** via `loadComponent` | Faster initial bundle |
