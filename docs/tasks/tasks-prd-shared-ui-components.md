# Task List: Shared UI Components

Based on: `docs/prd/prd-shared-ui-components.md`

---

## Relevant Files

- `src/app/shared/ui/index.ts` - Barrel export file for all shared UI components, directives, and services.
- `src/app/shared/utils/avatar.util.ts` - Pure utility function for deriving deterministic initials color from a name string.
- `src/app/shared/utils/avatar.util.spec.ts` - Unit tests for avatar utility.
- `src/app/shared/ui/alert/alert.component.ts` - Alert component with type variants and dismiss support.
- `src/app/shared/ui/alert/alert.component.html` - Alert template.
- `src/app/shared/ui/alert/alert.component.spec.ts` - Unit tests for AlertComponent.
- `src/app/shared/ui/toast/toast.service.ts` - ToastService wrapping ngx-toastr.
- `src/app/shared/ui/toast/toast.service.spec.ts` - Unit tests for ToastService.
- `src/app/shared/ui/modal/modal.component.ts` - Standalone Modal shell component (header, body, footer slots).
- `src/app/shared/ui/modal/modal.component.html` - Modal template.
- `src/app/shared/ui/modal/modal.component.spec.ts` - Unit tests for ModalComponent.
- `src/app/shared/ui/modal/modal.service.ts` - ModalService wrapping MatDialog.
- `src/app/shared/ui/modal/modal.service.spec.ts` - Unit tests for ModalService.
- `src/app/shared/ui/tooltip/tooltip.directive.ts` - TooltipDirective wrapping matTooltip.
- `src/app/shared/ui/tooltip/tooltip.directive.spec.ts` - Unit tests for TooltipDirective.
- `src/app/shared/ui/popover/popover.component.ts` - PopoverComponent using CDK Overlay.
- `src/app/shared/ui/popover/popover.component.html` - Popover template.
- `src/app/shared/ui/popover/popover-trigger.directive.ts` - PopoverTrigger directive.
- `src/app/shared/ui/popover/popover.component.spec.ts` - Unit tests for PopoverComponent.
- `src/app/shared/ui/spinner/spinner.component.ts` - Spinner component with size and color inputs.
- `src/app/shared/ui/spinner/spinner.component.html` - Spinner template.
- `src/app/shared/ui/spinner/spinner.component.spec.ts` - Unit tests for SpinnerComponent.
- `src/app/shared/ui/skeleton/skeleton-card.component.ts` - Skeleton card variant.
- `src/app/shared/ui/skeleton/skeleton-table-row.component.ts` - Skeleton table row variant.
- `src/app/shared/ui/skeleton/skeleton-avatar.component.ts` - Skeleton avatar variant.
- `src/app/shared/ui/skeleton/skeleton.component.spec.ts` - Unit tests for all skeleton variants.
- `src/app/shared/ui/progress-bar/progress-bar.component.ts` - Progress bar component.
- `src/app/shared/ui/progress-bar/progress-bar.component.html` - Progress bar template.
- `src/app/shared/ui/progress-bar/progress-bar.component.spec.ts` - Unit tests for ProgressBarComponent.
- `src/app/shared/ui/badge/badge.component.ts` - Badge component with variant, size, and dot mode.
- `src/app/shared/ui/badge/badge.component.html` - Badge template.
- `src/app/shared/ui/badge/badge.component.spec.ts` - Unit tests for BadgeComponent.
- `src/app/shared/ui/avatar/avatar.component.ts` - Avatar component with image/initials/icon fallback.
- `src/app/shared/ui/avatar/avatar.component.html` - Avatar template.
- `src/app/shared/ui/avatar/avatar.component.spec.ts` - Unit tests for AvatarComponent.
- `src/app/shared/ui/card/card.component.ts` - Card component with named ng-content slots.
- `src/app/shared/ui/card/card.component.html` - Card template.
- `src/app/shared/ui/card/card.component.spec.ts` - Unit tests for CardComponent.
- `tsconfig.json` - May need `@shared/ui` path alias added.

### Notes

- Angular component tests use Jasmine + Karma: run `ng test --no-watch --browsers=ChromeHeadless`.
- Plain TypeScript utility tests (no Angular) can run with `npx vitest run <file>`.
- All components must use `ChangeDetectionStrategy.OnPush` and be standalone.
- Use semantic Tailwind color tokens only — never hardcode `bg-blue-500` etc.
- Icons must use `lucide-angular` only.

---

## Tasks

- [x] 1.0 Project Setup & Barrel Export Infrastructure
  - [x] 1.1 Create the shared UI directory structure
    - Create the following directories (or verify they exist):
      - `src/app/shared/ui/alert/`
      - `src/app/shared/ui/toast/`
      - `src/app/shared/ui/modal/`
      - `src/app/shared/ui/tooltip/`
      - `src/app/shared/ui/popover/`
      - `src/app/shared/ui/spinner/`
      - `src/app/shared/ui/skeleton/`
      - `src/app/shared/ui/progress-bar/`
      - `src/app/shared/ui/badge/`
      - `src/app/shared/ui/avatar/`
      - `src/app/shared/ui/card/`
      - `src/app/shared/utils/`
  - [x] 1.2 Create the barrel export file
    - Create `src/app/shared/ui/index.ts`.
    - This file will remain mostly empty at first and be updated as each component is built. Add a placeholder comment: `// Shared UI Components — exports added incrementally`.
  - [x] 1.3 Add `@shared/ui` path alias to `tsconfig.json`
    - Open `tsconfig.json` and add to the `paths` section:
      ```json
      "@shared/ui": ["src/app/shared/ui/index.ts"]
      ```
    - This allows feature modules to import with `import { ... } from '@shared/ui'`.
  - [x] 1.4 Create avatar utility function
    - Create `src/app/shared/utils/avatar.util.ts`.
    - Export a pure function `getAvatarColor(name: string): string` that:
      1. Converts the name string to a numeric hash (simple char-code sum).
      2. Maps the hash modulo N to one of N semantic background color classes (e.g., `bg-primary`, `bg-success`, `bg-warning`, `bg-danger`, `bg-info`).
      3. Returns the Tailwind class string.
    - Export a second pure function `getInitials(name: string): string` that:
      1. Splits the name by spaces.
      2. Takes the first character of the first and last word (uppercased).
      3. Returns a 1–2 character string.

- [x] 2.0 Feedback Components — Alert, Spinner, Progress Bar
  - [x] 2.1 Build AlertComponent
    - Create `src/app/shared/ui/alert/alert.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`.
    - Inputs:
      - `type: 'success' | 'warning' | 'error' | 'info'` (default: `'info'`)
      - `title: string` (optional)
      - `message: string`
      - `dismissible: boolean` (default: `false`)
    - Output: `dismissed = new EventEmitter<void>()`
    - Template logic:
      - Use a `switch` or map to select the correct Lucide icon per type (`CheckCircle`, `AlertTriangle`, `XCircle`, `Info`).
      - Use a computed signal or getter to return the correct Tailwind semantic classes per type (e.g., `bg-success/10 text-success border-success/20` for success).
      - When `dismissible` is true, render a close button (Lucide `X` icon). On click, emit `dismissed` and set an internal `visible` signal to `false`.
    - Add `role="alert"` to the host element or root div.
    - Export `AlertComponent` from `src/app/shared/ui/index.ts`.
  - [x] 2.2 Build SpinnerComponent
    - Create `src/app/shared/ui/spinner/spinner.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`.
    - Inputs:
      - `size: 'sm' | 'md' | 'lg'` (default: `'md'`)
      - `color: 'primary' | 'white' | 'muted'` (default: `'primary'`)
    - Template:
      - Render an SVG or a `div` with Tailwind `animate-spin` and `rounded-full border-2 border-t-transparent`.
      - Map `size` to Tailwind dimension classes: `sm → w-4 h-4`, `md → w-6 h-6`, `lg → w-10 h-10`.
      - Map `color` to border color semantic tokens: `primary → border-primary`, `white → border-white`, `muted → border-muted-foreground`.
      - Include a visually hidden `<span class="sr-only">Loading</span>`.
      - Add `role="status"` to the root element.
    - Export `SpinnerComponent` from `src/app/shared/ui/index.ts`.
  - [x] 2.3 Build ProgressBarComponent
    - Create `src/app/shared/ui/progress-bar/progress-bar.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`.
    - Inputs:
      - `value: number` (0–100, default: `0`)
      - `color: 'primary' | 'success' | 'warning' | 'danger'` (default: `'primary'`)
      - `showLabel: boolean` (default: `false`)
    - Template:
      - Outer track div: `w-full bg-muted rounded-full h-2`.
      - Inner fill div: `[style.width.%]="value"` with semantic background class based on `color` input.
      - When `showLabel` is true, render `{{ value }}%` as text alongside the bar.
      - Add `role="progressbar"`, `[attr.aria-valuenow]="value"`, `aria-valuemin="0"`, `aria-valuemax="100"` to the host or root element.
    - Export `ProgressBarComponent` from `src/app/shared/ui/index.ts`.

- [x] 3.0 Notification & Overlay Components — Toast Service, Modal, Tooltip, Popover
  - [x] 3.1 Build ToastService
    - Ensure `ngx-toastr` is installed (`pnpm add ngx-toastr` if not present).
    - Ensure `provideToastr({ positionClass: 'toast-top-right', ... })` is added to `app.config.ts`.
    - Create `src/app/shared/ui/toast/toast.service.ts`.
    - Inject `ToastrService` from `ngx-toastr`.
    - Expose four public methods:
      - `success(message: string, title?: string): void`
      - `error(message: string, title?: string): void`
      - `warning(message: string, title?: string): void`
      - `info(message: string, title?: string): void`
    - Each method calls the corresponding `ToastrService` method internally.
    - Provide the service in `root` (`providedIn: 'root'`).
    - Export `ToastService` from `src/app/shared/ui/index.ts`.
  - [x] 3.2 Build ModalComponent and ModalService
    - Create `src/app/shared/ui/modal/modal.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`.
    - Inputs:
      - `title: string`
      - `size: 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
    - Output: `closed = new EventEmitter<void>()`
    - Template structure:
      - Header div: displays `title` and a close button (Lucide `X`). Close button click calls `MatDialogRef.close()` and emits `closed`.
      - Body div: `<ng-content select="[modal-body]"></ng-content>`
      - Footer div: `<ng-content select="[modal-footer]"></ng-content>` (only rendered if content is projected).
    - Map `size` to `MatDialogConfig` `width`: `sm → 400px`, `md → 560px`, `lg → 720px`, `xl → 960px`.
    - Add `role="dialog"` and `[attr.aria-labelledby]` pointing to the title element's ID.
    - Create `src/app/shared/ui/modal/modal.service.ts` provided in `root`:
      - Inject `MatDialog`.
      - Method `open<T>(component: ComponentType<T>, config?: MatDialogConfig): MatDialogRef<T>` — delegates to `MatDialog.open()`.
      - Method `closeAll(): void` — delegates to `MatDialog.closeAll()`.
    - Export both `ModalComponent` and `ModalService` from `src/app/shared/ui/index.ts`.
  - [x] 3.3 Build TooltipDirective
    - Create `src/app/shared/ui/tooltip/tooltip.directive.ts` as a standalone directive.
    - Inputs:
      - `tooltip: string` — the tooltip text.
      - `tooltipPosition: 'above' | 'below' | 'left' | 'right'` (default: `'above'`)
    - Implementation:
      - Inject `MatTooltip` from `@angular/material/tooltip` via host binding, or apply `matTooltip` and `matTooltipPosition` as host directives.
      - Alternatively, use `@HostBinding` to forward the `matTooltip` and `matTooltipPosition` values.
      - The simplest approach: make `TooltipDirective` a wrapper that uses `MatTooltip` as a `hostDirectives` entry, mapping inputs.
    - Export `TooltipDirective` from `src/app/shared/ui/index.ts`.
  - [x] 3.4 Build PopoverComponent and PopoverTriggerDirective
    - Create `src/app/shared/ui/popover/popover-trigger.directive.ts` as a standalone directive (`[popoverTrigger]`).
    - Input: `popoverTrigger: TemplateRef<unknown>` — the template to render inside the popover panel.
    - Implementation using Angular CDK `Overlay`:
      1. Inject `Overlay` and `ViewContainerRef`.
      2. On host `(click)`, create an overlay positioned relative to the host element (use `FlexibleConnectedPositionStrategy`, preferred position: below-start).
      3. Create a `TemplatePortal` from the `popoverTrigger` template and attach it to the overlay.
      4. Listen for `backdropClick()` and `keydownEvents()` (Escape) on the overlay ref to close and dispose.
    - Create `src/app/shared/ui/popover/popover.component.ts` as a standalone component:
      - Provides a styled container shell (white/surface background, `rounded-lg shadow-lg border border-border p-4`) for the popover content.
      - Used as the wrapper when consumers want a pre-styled panel; content is projected via `<ng-content>`.
    - Export both from `src/app/shared/ui/index.ts`.

- [x] 4.0 Skeleton Loader Variants
  - [x] 4.1 Build SkeletonCardComponent
    - Create `src/app/shared/ui/skeleton/skeleton-card.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`.
    - Input: `count: number` (default: `1`)
    - Template (repeated `count` times via `@for`):
      - Outer div with `animate-pulse` and card-like padding.
      - Title bar: `h-4 bg-muted rounded w-3/4 mb-3`
      - Body block: `h-20 bg-muted rounded`
    - Export from `src/app/shared/ui/index.ts`.
  - [x] 4.2 Build SkeletonTableRowComponent
    - Create `src/app/shared/ui/skeleton/skeleton-table-row.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`.
    - Input: `count: number` (default: `1`)
    - Template (repeated `count` times via `@for`):
      - Row div with `animate-pulse flex gap-4 items-center py-3`.
      - Column bars of varying widths: e.g., `w-8 h-8 rounded-full bg-muted` (avatar col), `h-3 bg-muted rounded w-1/4`, `h-3 bg-muted rounded w-1/3`, `h-3 bg-muted rounded w-1/5`.
    - Export from `src/app/shared/ui/index.ts`.
  - [x] 4.3 Build SkeletonAvatarComponent
    - Create `src/app/shared/ui/skeleton/skeleton-avatar.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`.
    - Input: `count: number` (default: `1`)
    - Template (repeated `count` times via `@for`):
      - Wrapper div with `animate-pulse flex items-center gap-3`.
      - Circle: `w-10 h-10 rounded-full bg-muted`
      - Text block: two stacked bars — `h-3 bg-muted rounded w-24 mb-1` and `h-2 bg-muted rounded w-16`.
    - Export from `src/app/shared/ui/index.ts`.

- [x] 5.0 Display Components — Badge, Avatar, Card
  - [x] 5.1 Build BadgeComponent
    - Create `src/app/shared/ui/badge/badge.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`.
    - Inputs:
      - `variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted'` (default: `'primary'`)
      - `size: 'sm' | 'md'` (default: `'md'`)
      - `dot: boolean` (default: `false`)
    - Template:
      - When `dot` is false: render `<span>` with projected `<ng-content>` and apply classes from a `variant`→class map (e.g., `success → bg-success/10 text-success`).
      - When `dot` is true: render a small filled circle (`w-2 h-2 rounded-full`) with the semantic background color — no text content.
      - Map `size` to padding/text classes: `sm → text-xs px-1.5 py-0.5`, `md → text-xs px-2 py-0.5`.
    - Export `BadgeComponent` from `src/app/shared/ui/index.ts`.
  - [x] 5.2 Build AvatarComponent
    - Create `src/app/shared/ui/avatar/avatar.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`.
    - Inputs:
      - `src: string | null` (default: `null`)
      - `name: string` (default: `''`)
      - `icon: LucideIconData | null` (default: `null`) — used as third fallback
      - `size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
    - Internal state: a signal `imgFailed = signal(false)`
    - Template logic:
      1. If `src` is set and `imgFailed()` is false: render `<img [src]="src" (error)="imgFailed.set(true)" />`.
      2. Else if `name` is non-empty: render initials div using `getInitials(name)` and `getAvatarColor(name)` from the avatar utility.
      3. Else if `icon` is set: render a Lucide icon centered in the avatar.
      4. Fallback: render a generic user silhouette (`User` Lucide icon).
    - Map `size` to dimension classes: `xs → w-6 h-6 text-xs`, `sm → w-8 h-8 text-sm`, `md → w-10 h-10 text-sm`, `lg → w-12 h-12 text-base`, `xl → w-16 h-16 text-lg`.
    - All avatar variants share base classes: `rounded-full overflow-hidden flex items-center justify-center font-medium`.
    - Export `AvatarComponent` from `src/app/shared/ui/index.ts`.
  - [x] 5.3 Build CardComponent
    - Create `src/app/shared/ui/card/card.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`.
    - Inputs:
      - `noPadding: boolean` (default: `false`)
      - `elevated: boolean` (default: `false`)
    - Template:
      - Root div base classes: `bg-card border border-border rounded-lg`.
      - When `elevated` is true: add `shadow-md`; otherwise `shadow-sm`.
      - Header slot: `<div class="px-6 py-4 border-b border-border"><ng-content select="[card-header]"></ng-content></div>` — only rendered when content is projected (use `@if` with a content child check or always render and let consumers decide).
      - Body slot: `<div [class.p-6]="!noPadding"><ng-content select="[card-body]"></ng-content></div>`.
      - Footer slot: `<div class="px-6 py-4 border-t border-border"><ng-content select="[card-footer]"></ng-content></div>`.
    - Export `CardComponent` from `src/app/shared/ui/index.ts`.

- [x] 6.0 Unit Tests for All Components
  - [x] 6.1 Tests for AlertComponent
    - Test that the correct icon and class are applied per `type` input.
    - Test that `title` and `message` are rendered in the template.
    - Test that the close button is not rendered when `dismissible` is false.
    - Test that clicking the close button emits `dismissed` and hides the component when `dismissible` is true.
  - [x] 6.2 Tests for ToastService
    - Mock `ToastrService`.
    - Test that calling `success()`, `error()`, `warning()`, `info()` delegates to the corresponding `ToastrService` methods with correct arguments.
  - [x] 6.3 Tests for ModalComponent and ModalService
    - Test that `title` is rendered in the header.
    - Test that clicking the close button emits `closed`.
    - Test that `ModalService.open()` calls `MatDialog.open()` with the correct component.
    - Test that `ModalService.closeAll()` calls `MatDialog.closeAll()`.
  - [x] 6.4 Tests for TooltipDirective
    - Test that the directive applies `matTooltip` and `matTooltipPosition` with the correct values from inputs.
  - [x] 6.5 Tests for SpinnerComponent
    - Test that the correct size class is applied per `size` input.
    - Test that `role="status"` is present.
    - Test that the sr-only "Loading" text is present.
  - [x] 6.6 Tests for Skeleton components
    - Test that `SkeletonCardComponent` renders the correct number of items when `count` is set.
    - Test that `SkeletonTableRowComponent` renders the correct number of rows.
    - Test that `SkeletonAvatarComponent` renders the correct number of avatar placeholders.
  - [x] 6.7 Tests for ProgressBarComponent
    - Test that the fill width matches the `value` input.
    - Test that `aria-valuenow` reflects the `value` input.
    - Test that the label is shown/hidden based on `showLabel`.
  - [x] 6.8 Tests for BadgeComponent
    - Test that `dot` mode renders a circle element instead of text content.
    - Test that variant classes are applied correctly.
  - [x] 6.9 Tests for AvatarComponent and avatar utility
    - Test `getInitials('John Doe')` returns `'JD'`.
    - Test `getInitials('Alice')` returns `'A'`.
    - Test `getAvatarColor('test')` returns a valid semantic class string.
    - Test that AvatarComponent renders `<img>` when `src` is set and `imgFailed` is false.
    - Test that AvatarComponent renders initials when `src` is null and `name` is set.
    - Test that AvatarComponent renders the icon when both `src` and `name` are absent but `icon` is set.
  - [x] 6.10 Tests for CardComponent
    - Test that `shadow-md` is applied when `elevated` is true.
    - Test that the body div has no padding class when `noPadding` is true.
