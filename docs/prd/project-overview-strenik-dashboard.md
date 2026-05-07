# Project Overview: Strenik Dashboard

## 1. Project Summary

Strenik Dashboard is a reusable, enterprise-grade Angular dashboard template designed to serve as the foundation for all future internal and SaaS web applications. It solves the problem of starting from scratch on every new project by providing a fully structured, themeable, and scalable UI framework with authentication, role-based access, reusable components, and a consistent design system baked in. The primary users are internal development teams building admin panels, SaaS products, and enterprise applications.

---

## 2. User Types

| Role | Description |
|---|---|
| Admin | Full access to all features, settings, and user management |
| Regular User | Access to assigned features and personal profile/settings |
| Guest / Public | Access only to public-facing pages and auth flows |

---

## 3. Feature Modules

| Module | Description | Priority |
|---|---|---|
| Core Infrastructure | App config, routing, interceptors (auth, error), typed API base service, environment setup | Must Have |
| Theme System | CSS variable-based light/dark/system mode + multi-color themes (blue, emerald, violet, amber, slate) with localStorage persistence | Must Have |
| Authentication | JWT login/register/forgot/reset password flows, refresh token, route guards, `*hasPermission` directive | Must Have |
| Admin Layout | Sidebar (collapsible, nested, mini, mobile), top navbar, breadcrumbs, profile dropdown, notifications, theme switcher | Must Have |
| Auth Layout | Login, register, forgot password, reset password pages | Must Have |
| Shared UI Components | Alert, toast, modal, tooltip, popover, spinner, skeleton loader, progress bar, badge, avatar, card | Must Have |
| Form Components | Text, email, password, number, textarea, radio, checkbox, select, multi-select, autocomplete, date picker, time picker, color picker, file/image upload, drag-drop upload, tags input, WYSIWYG editor | Must Have |
| Table Component | Reusable data table with sorting, filtering, pagination, row selection, bulk actions, loading/empty states, server-side support | Must Have |
| Dashboard Page | Stat cards, charts (ng-apexcharts), activity feed, recent table, responsive widgets | Must Have |
| Users CRUD | Demo feature page with full create/read/update/delete using the base CRUD pattern | Must Have |
| Products CRUD | Demo feature page showcasing reusable CRUD abstraction | Must Have |
| Settings Page | App-level settings demo | Must Have |
| Profile Page | User profile view and edit | Must Have |
| Error Pages | 401, 403, 404, 500 pages | Must Have |
| Navigation Components | Sidebar, top navbar, breadcrumb, tabs, dropdown, pagination | Must Have |
| Permission System | Role-based route guards and `*hasPermission` structural directive | Must Have |
| Base Abstractions | Base table, base modal, base form field, base CRUD page, base API service, base confirmation dialog | Must Have |
| Blank Layout | Used for landing, public, and error pages | Must Have |
| Development Tooling | ESLint, Prettier, Husky, lint-staged configuration | Nice to Have |
| Testing Setup | Vitest unit tests + Cypress e2e scaffolding | Nice to Have |
| Export Table Data | CSV and Excel export for data tables | Nice to Have |
| Column Visibility | Toggle visible columns in data table | Nice to Have |
| Sticky Table Header | Optional sticky header in data table | Nice to Have |
| Storybook / Component Docs | Living documentation for shared UI components | Future |
| Multi-tenant Support | Per-tenant theming or data isolation | Future |
| i18n / Localization | Multi-language support | Future |

---

## 4. Out of Scope

- Backend API implementation (template uses mock/typed DTOs only)
- Real database or backend services
- Payment or billing systems
- Mobile native apps (iOS/Android)
- Real-time collaboration features
- Third-party analytics integrations

---

## 5. Key Constraints

| Constraint | Detail |
|---|---|
| Framework | Angular latest stable, standalone components only, OnPush change detection |
| State management | Angular Signals — NgRx only if truly necessary |
| Styling | Tailwind CSS with semantic color tokens only — no hardcoded Tailwind color utilities |
| UI Library | Angular Material for overlays, dialogs, tables, date pickers, tabs, tooltips, menus |
| Icons | Lucide Angular only |
| Notifications | ngx-toastr |
| Charts | ng-apexcharts |
| Package manager | pnpm |
| TypeScript | Strict mode enforced |
| Forms | Reactive Forms only |

---

## 6. Suggested PRD Order

1. **Core Infrastructure** — App bootstrap, routing, interceptors, API base service, environment config
2. **Theme System** — CSS variables, light/dark/system/multi-color themes, localStorage persistence, theme switcher component
3. **Auth Layout + Authentication** — Login, register, forgot/reset password pages; JWT flow, guards, `*hasPermission` directive
4. **Admin Layout** — Sidebar, top navbar, breadcrumbs, profile dropdown, notifications
5. **Base Abstractions** — Base table, modal, form field, CRUD page, API service, confirmation dialog
6. **Shared UI Components** — Feedback (alert, toast, modal, tooltip, popover, spinner, skeleton, progress bar), display (badge, avatar, card)
7. **Form Components** — All input types through WYSIWYG editor
8. **Table Component** — Full-featured reusable data table
9. **Dashboard Page** — Stat cards, charts, activity feed, recent table
10. **Users CRUD** — Demo feature using base abstractions
11. **Products CRUD** — Second demo feature page
12. **Settings + Profile Pages** — App settings and user profile
13. **Error Pages** — 401, 403, 404, 500
14. **Navigation Components** — Breadcrumb, tabs, dropdown, pagination (if not covered in Admin Layout)
15. **Development Tooling** — ESLint, Prettier, Husky, lint-staged
16. **Testing Setup** — Vitest + Cypress scaffolding

---

## 7. Open Questions

- Should the template ship with a mock API layer (e.g., in-memory data or MSW) for demo pages, or rely on hardcoded static data?
- Is there a preferred Angular Material version to pin to, or always latest stable?
- Should the sidebar menu structure be driven by a static config object or a dynamic API response?
- Are there specific accessibility compliance levels required (e.g., WCAG 2.1 AA)?
- Should demo CRUD pages (Users, Products) include server-side pagination simulation?

---

> Generated from `templates/breakdown-project.md` using `docs/claude_project_guideline_dashboard_template_md.md` as source.
>
> **Next step:** Use `templates/create-prd.md` to create a PRD for each module, starting with **Core Infrastructure** (item 1 in the Suggested PRD Order above).
