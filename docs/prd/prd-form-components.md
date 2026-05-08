# PRD: Form Components

## 1. Introduction / Overview

This PRD defines the reusable form input components for the Strenik Dashboard. These components are **thin input-only wrappers** — they render the control itself but do not own label, hint, or error text layout (that is the parent's responsibility). They integrate with Angular Reactive Forms via `ControlValueAccessor` and also support `ngModel` two-way binding.

The goal is to produce a consistent, accessible, and themeable library of form controls that any feature page can compose freely without duplicating input logic.

---

## 2. Goals

1. Provide a complete set of form input controls covering all common use cases.
2. All components implement `ControlValueAccessor` and support both Reactive Forms and `ngModel`.
3. All components accept a `size` input (`sm` | `md` | `lg`) for consistent visual scaling.
4. Components self-apply invalid visual state (red border) when the bound control is invalid and touched — parent is only responsible for showing error text.
5. Components use only semantic Tailwind color tokens (no hardcoded colors).
6. A `/dev/forms` demo route showcases all components in action.

---

## 3. User Stories

- As a developer, I want to drop a `<app-input>` into a reactive form and have it wire up automatically, so I don't write boilerplate `ControlValueAccessor` code per feature.
- As a developer, I want components to show a red border when a field is invalid and touched, so I only need to render the error message text — not manage visual state.
- As a developer, I want to pass `size="sm"` to shrink a control, so I can compose compact forms without fighting CSS.
- As a developer, I want `<app-select>` and `<app-autocomplete>` to accept an `Observable<Option[]>` so I can wire them to a search API without custom adapters.
- As a developer, I want `<app-file-upload>` to emit `File` objects, so I control how and where files are uploaded.
- As a developer, I want to visit `/dev/forms` and see every component rendered with live controls, so I can verify behavior during development.

---

## 4. Functional Requirements

### 4.1 General Requirements (all components)

1. Every component must be a standalone Angular component.
2. Every component must implement `ControlValueAccessor` and be compatible with `formControl`, `formControlName`, and `[(ngModel)]`.
3. Every component must accept a `size` input of type `'sm' | 'md' | 'lg'` (default: `'md'`).
4. Every component must accept a `disabled` input and honor the `setDisabledState` lifecycle from the forms API.
5. When the bound control is invalid AND touched, the component must apply an error visual state (red border using the `border-danger` semantic token) without any parent configuration.
6. All styling must use Tailwind semantic color tokens only. No hardcoded color utilities (e.g., no `border-red-500`).
7. All components must use `OnPush` change detection.
8. All components must be placed in `src/app/shared/components/forms/`.

### 4.2 Text Input (`<app-input>`)

9. Must support `type` input: `'text'` | `'email'` | `'password'` | `'number'` (default: `'text'`).
10. Password type must include a show/hide toggle button using a Lucide icon.
11. Must support `placeholder` input.
12. Must support optional `prefix` and `suffix` content projection slots for icons or text.

### 4.3 Textarea (`<app-textarea>`)

13. Must support `rows` input (default: `3`).
14. Must support `placeholder` input.
15. Must support `autoResize` boolean input — when true, the textarea grows with content.

### 4.4 Radio Group (`<app-radio-group>`)

16. Must accept an `options` input of type `{ label: string; value: unknown }[]`.
17. Must support `orientation` input: `'horizontal'` | `'vertical'` (default: `'vertical'`).

### 4.5 Checkbox (`<app-checkbox>`)

18. Must bind to a boolean control value.
19. Must support an `indeterminate` input boolean for tri-state display.
20. Must support a `label` input for inline label text.

### 4.6 Select (`<app-select>`)

21. Must accept `options` as `Option[]` or `Observable<Option[]>` where `Option = { label: string; value: unknown }`.
22. Must support a `placeholder` input shown when no value is selected.
23. Must use Angular Material `mat-select` internally.

### 4.7 Multi-Select (`<app-multi-select>`)

24. Must support the same `options` input as Select (static or Observable).
25. Must display selected values as removable chips/tags.
26. Must support a `maxSelections` input to cap how many items can be chosen.

### 4.8 Autocomplete (`<app-autocomplete>`)

27. Must accept `options` as `Option[]` or `Observable<Option[]>`.
28. When `Observable` is provided, the component emits a `search` output event with the current input string so the parent can feed filtered results.
29. Must use Angular Material `mat-autocomplete` internally.
30. Options must be selectable from a predefined list only (no free-text creation).

### 4.9 Date Picker (`<app-date-picker>`)

31. Must use Angular Material `mat-datepicker` internally.
32. Must bind to a `Date | null` control value.
33. Must support `min` and `max` date inputs.

### 4.10 Time Picker (`<app-time-picker>`)

34. Must use `ngx-mat-timepicker` alongside Angular Material date picker.
35. Must bind to a string control value in `HH:mm` format.
36. Must support `format` input: `12` | `24` (default: `24`).

### 4.11 Color Picker (`<app-color-picker>`)

37. Must bind to a hex string control value (e.g., `'#3b82f6'`).
38. Must show a color swatch preview of the current value.
39. Must use a native `<input type="color">` internally.

### 4.12 File Upload (`<app-file-upload>`)

40. Must emit selected files via a `filesSelected` output of type `File[]`.
41. Must NOT handle HTTP upload internally — file transfer is the parent's responsibility.
42. Must support `accept` input (MIME types or extensions, e.g., `'image/*'`).
43. Must support `multiple` boolean input.
44. Must display the selected file name(s) after selection.

### 4.13 Drag-and-Drop Upload (`<app-dropzone>`)

45. Must provide a drag-and-drop zone that highlights on dragover.
46. Must emit dropped files via a `filesDropped` output of type `File[]`.
47. Must also support click-to-browse as a fallback.
48. Must support `accept` and `multiple` inputs (same as File Upload).
49. Must NOT handle HTTP upload internally.

### 4.14 Tags Input (`<app-tags-input>`)

50. Must bind to a `string[]` control value representing selected tags.
51. Must support free-text tag creation: user types a value and presses Enter or comma to add it as a new tag.
52. Must accept an optional `suggestions` input of type `string[]` | `Observable<string[]>` — when provided, matching suggestions are shown as a dropdown while typing.
53. Must display selected tags as removable chips.
54. Must emit a `search` output event with the current input string when `suggestions` is an Observable, so the parent can feed filtered results.
55. Must support a `allowDuplicates` boolean input (default: `false`) to prevent adding the same tag twice.

### 4.15 WYSIWYG Editor (`<app-wysiwyg>`)

55. Must use Quill via **ngx-quill**.
56. Must bind to an HTML string control value.
57. Must support a `toolbar` input to configure visible toolbar options (default: standard formatting toolbar).
58. Must support `placeholder` input.

### 4.16 Demo Route (`/dev/forms`)

59. A `DevFormsComponent` must be added at the `/dev/forms` route, accessible only in non-production environments.
60. The demo page must render every form component with a live reactive form, showing all size variants and the error/disabled states.
61. The route must be lazy-loaded and not included in production builds.

---

## 5. Non-Goals (Out of Scope)

- Label, hint text, and error message rendering — these are the parent's responsibility.
- HTTP file upload handling — components emit `File` objects only.
- Free-text tag creation without any suggestion list (pure free-form tagging with no constraints).
- Storybook integration (listed as Future in the project overview).
- Custom date range picker (single date only for now).
- Form layout components (grid, fieldset, form group wrappers).

---

## 6. Design Considerations

- All components must follow the existing semantic color token system (`border-primary`, `bg-surface`, `text-danger`, etc.).
- Error state: apply `border-danger` ring/border when `control.invalid && control.touched`.
- Size variants should scale `padding`, `font-size`, and `height` — not just one dimension.
- Angular Material components (`mat-select`, `mat-datepicker`, `mat-autocomplete`) must be themed to match the dashboard's CSS variable–based theme, not Angular Material's default palette.
- Lucide Angular icons must be used for all internal icons (show/hide password, clear, calendar, etc.).

---

## 7. Technical Considerations

- All components go in `src/app/shared/components/forms/` with a barrel export from `index.ts`.
- Each component is a standalone Angular component with `OnPush` change detection.
- `ControlValueAccessor` must be provided via `NG_VALUE_ACCESSOR` in each component's `providers` array.
- For components accepting `Observable<Option[]>`, use `async` pipe internally and `takeUntilDestroyed` to manage subscriptions.
- `ngx-quill` and `ngx-mat-timepicker` must be installed via pnpm and declared as peer dependencies.
- The `/dev/forms` route must be gated by an environment check (`environment.production === false`) or a `canActivate` guard that checks the environment.
- Reactive Forms integration must be tested with Vitest; Cypress e2e tests should cover the demo page interactions.

---

## 8. Success Metrics

- All 15 form component types are implemented and exported from the shared barrel.
- Every component passes Vitest unit tests covering: value changes, disabled state, invalid+touched styling, and size variants.
- The `/dev/forms` demo page renders all components without console errors.
- Zero hardcoded Tailwind color utilities in component templates or styles.
- All components work identically with `formControl`, `formControlName`, and `[(ngModel)]`.

---

## 9. Open Questions

- Should the demo route `/dev/forms` require authentication, or be publicly accessible in dev mode?
- Should Angular Material components be wrapped to hide their internal implementation from consumers, or left partially exposed (e.g., passing `matDatepickerFilter` through)?
- Is `ngx-mat-timepicker` compatible with the current Angular Material version in use? Verify before implementation.
- Should the color picker support a palette of preset colors in addition to the native color wheel?
