# PRD: Shared UI Components

## 1. Introduction / Overview

This PRD covers the design and implementation of the Shared UI Component library for the Strenik Dashboard. These are general-purpose, reusable UI primitives used across all feature pages. They are split into two categories:

- **Feedback components:** Alert, Toast, Modal, Tooltip, Popover, Spinner, Skeleton Loader, Progress Bar
- **Display components:** Badge, Avatar, Card

All components are standalone Angular components exported through a `SharedUiModule` barrel. They follow the project's Tailwind semantic token system, use Lucide Angular icons, and include basic ARIA attributes where appropriate.

---

## 2. Goals

- Provide a consistent set of UI primitives that any feature page can use without re-implementing.
- Ensure all components use semantic Tailwind color tokens (never hardcoded colors).
- Export all components cleanly through a single barrel so feature modules only need one import.
- Keep components simple, composable, and easy for a junior developer to use via `@Input()` properties.

---

## 3. User Stories

- As a developer, I want to show a dismissible alert banner so that I can communicate success, warning, error, or info states to the user.
- As a developer, I want to trigger a toast notification from a service so that I can show transient feedback without managing UI state manually.
- As a developer, I want to open a modal dialog with custom content so that I can present confirmations, forms, or detail views without leaving the page.
- As a developer, I want to attach a tooltip to any element so that I can provide contextual hints without cluttering the UI.
- As a developer, I want to show a popover with rich content on click so that I can present more detail than a tooltip allows.
- As a developer, I want to show a spinner during loading states so that the user knows something is happening.
- As a developer, I want pre-built skeleton variants so that I can show placeholder layouts while data loads.
- As a developer, I want a progress bar component so that I can visualize task completion or upload progress.
- As a developer, I want a badge component so that I can label statuses, counts, or categories inline.
- As a developer, I want an avatar component that falls back gracefully so that user representations always render even without a photo.
- As a developer, I want a card component so that I can group related content with consistent padding, border, and shadow.

---

## 4. Functional Requirements

### 4.1 Alert

1. The Alert component must accept a `type` input: `'success' | 'warning' | 'error' | 'info'` (default: `'info'`).
2. The Alert must display an appropriate Lucide icon per type (e.g., `CheckCircle`, `AlertTriangle`, `XCircle`, `Info`).
3. The Alert must accept a `message` input (string) and an optional `title` input (string).
4. The Alert must support an optional `dismissible` input (boolean, default `false`). When true, a close button is shown and clicking it emits a `dismissed` output event and hides the component.
5. The Alert must use semantic color tokens: `bg-success`, `text-success`, `bg-warning`, `text-warning`, etc.
6. The Alert must include `role="alert"` for screen readers.

### 4.2 Toast (ngx-toastr wrapper)

7. A `ToastService` must wrap `ngx-toastr` and expose typed methods: `success(message, title?)`, `error(message, title?)`, `warning(message, title?)`, `info(message, title?)`.
8. The `ToastService` must be provided in `root` and injectable anywhere.
9. Toast position must default to `top-right` and be configurable via the ngx-toastr global config in `app.config.ts`.
10. No custom Toast component is required — `ngx-toastr` handles rendering.

### 4.3 Modal

11. A `ModalComponent` must be a standalone component that wraps Angular Material `MatDialog` with a consistent shell: header (title + close button), scrollable content area, and optional footer (action buttons).
12. The Modal must accept a `title` input (string).
13. The Modal must emit a `closed` output event when the close button is clicked.
14. The modal content must be projected via `<ng-content>` slots: `[modal-body]` and `[modal-footer]`.
15. The Modal must include `role="dialog"` and `aria-labelledby` pointing to the title element.
16. A `ModalService` must provide `open(component, config?)` and `closeAll()` helper methods wrapping `MatDialog`.
17. The Modal must support size variants via a `size` input: `'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`).

### 4.4 Tooltip

18. A `TooltipDirective` must wrap Angular Material `matTooltip` to apply consistent default positioning (`above`) and styling.
19. The directive must accept a `tooltip` input (string) used as the tooltip text.
20. The directive must support an optional `tooltipPosition` input: `'above' | 'below' | 'left' | 'right'` (default: `'above'`).

### 4.5 Popover

21. A `PopoverComponent` must display a floating panel with arbitrary content on click of its trigger element.
22. The Popover must use Angular Material `MatMenu` or `Overlay` as the positioning engine.
23. The popover trigger must be a directive (`[popoverTrigger]`) that accepts a `TemplateRef` input pointing to the popover content.
24. Clicking outside the popover or pressing `Escape` must close it.
25. The Popover must include `role="dialog"` or `role="tooltip"` as appropriate.

### 4.6 Spinner

26. A `SpinnerComponent` must render an animated loading indicator.
27. The Spinner must accept a `size` input: `'sm' | 'md' | 'lg'` (default: `'md'`).
28. The Spinner must accept a `color` input mapped to semantic tokens: `'primary' | 'white' | 'muted'` (default: `'primary'`).
29. The Spinner must include `role="status"` and a visually hidden `aria-label="Loading"` text.

### 4.7 Skeleton Loader

30. Three pre-built skeleton variants must be provided as standalone components:
    - `SkeletonCardComponent` — mimics a stat/content card layout (title bar + body block).
    - `SkeletonTableRowComponent` — mimics a table row (several horizontal bars of varying widths).
    - `SkeletonAvatarComponent` — mimics an avatar + name/subtitle pair (circle + two bars).
31. All skeleton variants must use a pulse/shimmer animation via Tailwind `animate-pulse`.
32. All skeleton variants must use `bg-muted` or equivalent semantic token for the placeholder color.
33. Each variant must accept a `count` input (number, default `1`) to render multiple instances stacked vertically.

### 4.8 Progress Bar

34. A `ProgressBarComponent` must render a horizontal bar showing completion percentage.
35. The Progress Bar must accept a `value` input (number, 0–100).
36. The Progress Bar must accept a `color` input: `'primary' | 'success' | 'warning' | 'danger'` (default: `'primary'`).
37. The Progress Bar must accept an optional `showLabel` input (boolean, default `false`) that, when true, displays the percentage value next to the bar.
38. The Progress Bar must include `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, and `aria-valuemax="100"`.

### 4.9 Badge

39. A `BadgeComponent` must render a small inline label.
40. The Badge must accept a `variant` input: `'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted'` (default: `'primary'`).
41. The Badge must accept a `size` input: `'sm' | 'md'` (default: `'md'`).
42. The Badge content must be projected via `<ng-content>`.
43. An optional `dot` input (boolean, default `false`) renders a small colored dot instead of text — useful for status indicators.

### 4.10 Avatar

44. An `AvatarComponent` must render a user/entity representation.
45. The Avatar must accept an `src` input (string | null) for an image URL.
46. The Avatar must accept a `name` input (string) used to generate initials when `src` is null or fails to load.
47. When `src` fails to load (via `(error)` binding), the Avatar must fall back to displaying initials derived from `name`.
48. The Avatar must accept an `icon` input (Lucide icon) as a third fallback when both `src` and `name` are unavailable.
49. The Avatar must accept a `size` input: `'xs' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`).
50. The Avatar background color for initials must be deterministically derived from the `name` string (e.g., simple hash → one of several semantic palette colors).

### 4.11 Card

51. A `CardComponent` must provide a styled content container with consistent padding, border, and shadow.
52. The Card must project content via named slots: `[card-header]`, `[card-body]`, `[card-footer]` (all optional).
53. The Card must accept a `noPadding` input (boolean, default `false`) to remove internal padding for full-bleed content.
54. The Card must accept a `elevated` input (boolean, default `false`) to apply a stronger shadow variant.

### 4.12 Barrel Export

55. All components, directives, and services above must be exported from `src/app/shared/ui/index.ts`.
56. Feature modules must be able to import any component with a single import from `@shared/ui`.

---

## 5. Non-Goals (Out of Scope)

- No dedicated showcase or demo page — components will be exercised within feature pages (Dashboard, Users, etc.).
- No custom Toast rendering — `ngx-toastr` handles all toast UI.
- No animation library beyond Tailwind utilities and Angular `@angular/animations` where needed.
- No date picker, select, or form-specific inputs — those belong in the Form Components PRD.
- No base modal refactor — the existing base modal abstraction remains unchanged; this Modal is a separate display component.

---

## 6. Design Considerations

- All components must use Tailwind semantic color tokens exclusively (`bg-primary`, `text-danger`, `border-muted`, etc.). Never use `bg-blue-500` or similar hardcoded utilities.
- Icons must use Lucide Angular (`lucide-angular`) only.
- Components must use `ChangeDetectionStrategy.OnPush`.
- All components must be standalone (no NgModule declarations).
- Border radius, shadow, and spacing must follow the project's existing Tailwind config conventions (e.g., `rounded-lg`, `shadow-sm`).

---

## 7. Technical Considerations

- **Angular Material dependency:** Modal (MatDialog) and Tooltip (matTooltip) depend on Angular Material already installed.
- **ngx-toastr:** Already installed. `ToastService` wraps it; no additional install needed. Ensure `provideToastr()` is in `app.config.ts`.
- **Popover positioning:** Use Angular CDK `Overlay` if `MatMenu` is not flexible enough for custom content.
- **Skeleton shimmer:** Tailwind's `animate-pulse` is sufficient; no external skeleton library needed.
- **Avatar initials hashing:** A pure function in a shared util file (e.g., `src/app/shared/utils/avatar.util.ts`) to keep the component clean.
- **Barrel path:** Configure `@shared/ui` path alias in `tsconfig.json` if not already present.

---

## 8. Success Metrics

- All 11 component groups are implemented, exported from the barrel, and pass unit tests.
- No hardcoded Tailwind color utilities exist in any component template.
- Each component has at least one Vitest unit test covering its primary `@Input()` behavior and any output events.
- A senior or junior developer can add any shared UI component to a feature page with a single import and minimal configuration.

---

## 9. Open Questions

- Should the `ModalService.open()` method support passing data into the opened component (like `MatDialog`'s `data` config), or keep it simple for now?
- Should the Card component support a `loading` state that automatically shows the `SkeletonCardComponent` in place of its content?
- Should Badge support a `removable` variant with an X button (useful for tag-style badges in filters)?
