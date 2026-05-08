# Angular Project Structure

## Overview

- **Framework:** Angular 20+ Standalone Components
- **State:** Signals (`signal()`, `input()`, `output()`)
- **Styling:** Tailwind CSS + Material + Lucide Icons
- **Architecture:** Feature-based folder structure

---

## Folder Structure

```
frontend/src/app/
├── app.ts                          # Root component
├── app.config.ts                   # App-level providers (HTTP, router, interceptors)
├── app.routes.ts                   # Root route definitions
│
├── features/                       # Domain feature modules
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── login/
│   │   │   └── login.component.ts
│   │   └── change-password/
│   │       └── change-password.component.ts
│   │
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.service.ts
│   │   ├── dashboard.model.ts
│   │   ├── auditor-dashboard/
│   │   │   └── auditor-dashboard.component.ts
│   │   └── auditee-dashboard/
│   │       └── auditee-dashboard.component.ts
│   │
│   ├── audits/
│   │   ├── audits.routes.ts
│   │   ├── audit.model.ts
│   │   ├── audit.service.ts
│   │   ├── audit-list/
│   │   │   └── audit-list.component.ts
│   │   ├── audit-form/
│   │   │   └── audit-form.component.ts
│   │   ├── audit-detail/
│   │   │   └── audit-detail.component.ts
│   │   ├── assignment/
│   │   │   └── audit-assignment.component.ts
│   │   ├── checklist-execution/
│   │   │   └── checklist-execution.component.ts
│   │   └── findings/
│   │       ├── finding.model.ts
│   │       ├── finding.service.ts
│   │       ├── finding-list.component.ts
│   │       ├── finding-form-modal.component.ts
│   │       ├── remediation-modal.component.ts
│   │       └── verification-modal.component.ts
│   │
│   ├── activity-logs/
│   │   ├── activity-logs.routes.ts
│   │   ├── activity-log.model.ts
│   │   ├── activity-log.service.ts
│   │   └── activity-log-list.component.ts
│   │
│   ├── notifications/
│   │   ├── notification.model.ts
│   │   ├── notification.service.ts
│   │   ├── notification-bell.component.ts
│   │   └── notification-list.component.ts
│   │
│   ├── organization/
│   │   ├── organization.routes.ts
│   │   ├── validators/
│   │   │   └── token-limit.validator.ts
│   │   └── components/
│   │       ├── organization-list/
│   │       │   └── organization-list.component.ts
│   │       ├── organization-form/
│   │       │   └── organization-form.component.ts
│   │       └── organization-settings/
│   │           └── organization-settings.component.ts
│   │
│   ├── users/
│   │   ├── users.routes.ts
│   │   ├── services/
│   │   │   └── user.service.ts
│   │   └── components/
│   │       ├── user-list/
│   │       │   └── user-list.component.ts
│   │       └── user-form/
│   │           └── user-form.component.ts
│   │
│   └── settings/
│       ├── settings.routes.ts
│       ├── severity-levels/
│       │   ├── models/
│       │   │   └── severity-level.model.ts
│       │   ├── services/
│       │   │   └── severity-level.service.ts
│       │   └── components/
│       │       ├── severity-level-list/
│       │       │   └── severity-level-list.component.ts
│       │       └── severity-level-form/
│       │           └── severity-level-form.component.ts
│       └── audit-templates/
│           ├── audit-templates.routes.ts
│           ├── models/
│           │   └── audit-template.model.ts
│           ├── services/
│           │   └── audit-template.service.ts
│           └── components/
│               ├── audit-template-list/
│               │   └── audit-template-list.component.ts
│               └── audit-template-form/
│                   └── audit-template-form.component.ts
│
├── layout/                         # App shell components
│   ├── header/
│   │   └── header.component.ts
│   ├── sidebar/
│   │   └── sidebar.component.ts
│   ├── footer/
│   │   └── footer.component.ts
│   ├── main-layout/
│   │   └── main-layout.component.ts
│   └── empty-layout/
│       └── empty-layout.component.ts
│
└── shared/                         # Cross-feature shared code
    ├── components/
    │   ├── ui/                     # Reusable UI component library
    │   │   ├── index.ts
    │   │   ├── button.component.ts
    │   │   ├── input.component.ts
    │   │   ├── select.component.ts
    │   │   ├── card.component.ts
    │   │   ├── modal.component.ts
    │   │   ├── alert.component.ts
    │   │   ├── spinner.component.ts
    │   │   ├── badge.component.ts
    │   │   ├── avatar.component.ts
    │   │   ├── checkbox.component.ts
    │   │   ├── switch.component.ts
    │   │   ├── tooltip.component.ts
    │   │   └── toast-container.component.ts
    │   └── unauthorized/
    │       └── unauthorized.component.ts
    ├── interceptors/
    │   ├── auth.interceptor.ts
    │   ├── error.interceptor.ts
    │   ├── logging.interceptor.ts
    │   └── api-response-unwrapper.interceptor.ts
    ├── guards/
    │   └── auth.guard.ts
    ├── models/                     # Shared TypeScript interfaces/types
    │   ├── base.model.ts
    │   ├── auth.model.ts
    │   ├── user.model.ts
    │   └── organization.model.ts
    ├── services/
    │   ├── base.service.ts
    │   ├── auth.service.ts
    │   ├── toast.service.ts
    │   ├── theme.service.ts
    │   ├── organization.service.ts
    │   ├── user-management.service.ts
    │   ├── error-handler.service.ts
    │   └── logging.service.ts
    ├── pipes/
    │   ├── format-date.pipe.ts
    │   └── format-status.pipe.ts
    ├── constants/
    │   └── roles.ts
    └── utils/
        └── error.utils.ts
```

---

## Feature Module Pattern

A flat feature (simple, no sub-features):

```
features/{feature}/
├── {feature}.routes.ts
├── {feature}.model.ts
├── {feature}.service.ts
└── {feature}-list.component.ts    # or other page components
```

A nested feature (with sub-components and services split out):

```
features/{feature}/
├── {feature}.routes.ts
├── {feature}.model.ts              # (optional — may live inside models/)
├── {feature}.service.ts            # (optional — may live inside services/)
├── models/
│   └── {feature}.model.ts
├── services/
│   └── {feature}.service.ts
├── validators/
│   └── {name}.validator.ts
└── components/
    ├── {feature}-list/
    │   └── {feature}-list.component.ts
    └── {feature}-form/
        └── {feature}-form.component.ts
```

---

## Naming Conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| Component | `{name}.component.ts` | `audit-list.component.ts` |
| Service | `{name}.service.ts` | `audit.service.ts` |
| Model | `{name}.model.ts` | `audit.model.ts` |
| Routes | `{feature}.routes.ts` | `audits.routes.ts` |
| Guard | `{name}.guard.ts` | `auth.guard.ts` |
| Interceptor | `{name}.interceptor.ts` | `auth.interceptor.ts` |
| Pipe | `{name}.pipe.ts` | `format-date.pipe.ts` |
| Validator | `{name}.validator.ts` | `token-limit.validator.ts` |
| Selector | `app-{kebab-name}` | `app-audit-list` |
| Class name | `{PascalName}Component` | `AuditListComponent` |

---

## Key Rules

- **No barrel imports** — import each file directly by path
- **No `@Input/@Output`** — use `input()`/`output()` signals
- **No `*ngIf/*ngFor`** — use `@if`/`@for`/`@switch` control flow
- **No `constructor()`** — use `inject()` for dependency injection
- **No raw Material markup** — always use shared UI components from `shared/components/ui/`
- **No `computed()`** — use methods or separate signals
- **Strict typing** — no `any`
- Each feature owns its routes file (`{feature}.routes.ts`)
- Shared code only goes in `shared/` — never import cross-feature
- Layout components (header, sidebar, footer) live in `layout/`, not `features/`
