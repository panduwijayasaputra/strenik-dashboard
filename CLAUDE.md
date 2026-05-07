# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

This is a **planning and template repository** for building an enterprise Angular dashboard. It does not yet contain Angular source code — it contains project guidelines and AI workflow templates used to drive development.

## Package Manager

Use `pnpm` for all package management commands.

## Development Workflow

This project uses a structured AI-assisted workflow with three template stages:

1. **Create PRD** — Use `templates/create-prd.md` to generate a Product Requirements Document. Ask clarifying questions before writing. Save output to `/docs/prd/prd-[feature-name].md`.

2. **Generate Tasks** — Use `templates/generate-tasks.md` to break a PRD into a task list. Generate parent tasks first, wait for user "Go", then expand sub-tasks. Save to `/docs/tasks/tasks-[prd-file-name].md`.

3. **Process Tasks** — Use `templates/process-task-list.md` when implementing. Rules:
   - Implement **one sub-task at a time**, stop and wait for user approval before proceeding
   - Mark sub-tasks `[x]` immediately on completion
   - When all sub-tasks under a parent are done: run tests → stage → commit (conventional commit format) → mark parent `[x]`
   - Keep "Relevant Files" section current

## Target Stack (when building the Angular app)

- **Framework:** Angular latest stable, standalone components, OnPush change detection
- **State:** Angular Signals (avoid NgRx unless truly necessary)
- **Styling:** Tailwind CSS with semantic color tokens — use `bg-primary`, `text-danger`, etc. Never hardcode colors like `bg-blue-500`
- **UI Library:** Angular Material (dialogs, overlays, date picker, table, tooltip, menu, tabs)
- **Icons:** Lucide Angular
- **Notifications:** ngx-toastr
- **Charts:** ng-apexcharts
- **Forms:** Reactive Forms
- **TypeScript:** strict mode
- **Testing:** Vitest + Cypress

## Architecture

```
src/app/
  core/          # api, auth, guards, interceptors, layouts, services, theme, utils
  shared/        # components, directives, models, pipes, ui, types
  features/      # dashboard, auth, users, settings, profile
```

Key architecture rules:
- All components must be standalone
- Build reusable base abstractions: base table, base modal, base form field, base CRUD page, base API service
- Theme system uses CSS variables + Tailwind semantic colors, persisted in localStorage
- Auth architecture: JWT + refresh token + role permissions + route guards + `*hasPermission` directive
- HTTP layer: auth interceptor + error interceptor + typed DTOs + centralized API services

## Theme System

Must support light/dark/system modes and multiple color themes (blue, emerald, violet, amber, slate) via CSS variables. Runtime switching with localStorage persistence.

## Git Conventions

Conventional commits: `feat:`, `fix:`, `refactor:`, etc.
