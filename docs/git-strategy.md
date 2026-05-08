# Git Strategy: Strenik Dashboard

## Branch Model

```
master
  └── development
        ├── feat/core-infrastructure-and-theme-system
        ├── feat/auth-layout-and-authentication
        ├── feat/admin-layout
        ├── feat/base-abstractions
        ├── feat/shared-ui-components
        ├── feat/form-components
        ├── feat/table-component
        ├── feat/dashboard-page
        ├── feat/users-crud
        ├── feat/products-crud
        ├── feat/settings-and-profile
        ├── feat/error-pages
        ├── feat/navigation-components
        ├── feat/development-tooling
        └── feat/testing-setup
```

---

## Branch Rules

| Branch | Rule |
|---|---|
| `master` | Protected. No direct commits or pushes. Only `development` can open a PR here. |
| `development` | Integration branch. All PRD feature branches are created from here and merged back here via PR. |
| `feat/*` | One branch per PRD. Always branch from `development`. Always PR back to `development`. |

---

## Workflow Per PRD

1. Checkout `development` and pull latest.
2. Create a new branch: `git checkout -b feat/[prd-name]`
3. Implement tasks for that PRD (one sub-task at a time per `process-task-list.md`).
4. When all tasks are complete and tests pass, open a PR from `feat/[prd-name]` → `development`.
5. After merge, delete the feature branch.

---

## Releasing to Master

Only `development` opens a PR to `master`. This happens when a stable, tested set of PRDs is ready to be promoted.

---

## Branch Naming

Pattern: `feat/[prd-file-name-without-prd-prefix]`

Examples:
- `feat/core-infrastructure-and-theme-system`
- `feat/auth-layout-and-authentication`
- `feat/admin-layout`
- `feat/base-abstractions`

For hotfixes on `development`: `fix/[short-description]`

---

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add sidebar collapsible behavior
fix: resolve token refresh loop
refactor: extract base table component
chore: update dependencies
```

Scope is optional but recommended for clarity:
```
feat(auth): implement JWT refresh flow
fix(table): correct sort direction on reload
```

---

## PRD-to-Branch Map

| PRD | Branch |
|---|---|
| Core Infrastructure & Theme System | `feat/core-infrastructure-and-theme-system` |
| Auth Layout & Authentication | `feat/auth-layout-and-authentication` |
| Admin Layout | `feat/admin-layout` |
| Base Abstractions | `feat/base-abstractions` |
| Shared UI Components | `feat/shared-ui-components` |
| Form Components | `feat/form-components` |
| Table Component | `feat/table-component` |
| Dashboard Page | `feat/dashboard-page` |
| Users CRUD | `feat/users-crud` |
| Products CRUD | `feat/products-crud` |
| Settings & Profile Pages | `feat/settings-and-profile` |
| Error Pages | `feat/error-pages` |
| Navigation Components | `feat/navigation-components` |
| Development Tooling | `feat/development-tooling` |
| Testing Setup | `feat/testing-setup` |
