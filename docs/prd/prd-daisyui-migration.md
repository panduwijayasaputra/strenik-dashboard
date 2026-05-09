# PRD: DaisyUI Migration — Remove Angular Material

## 1. Introduction / Overview

The Strenik Dashboard currently uses Angular Material for UI components and a bespoke CSS-variable theme system for runtime theming. This PRD covers a full app-wide migration to **DaisyUI** (a Tailwind CSS component library) as the sole UI component layer, replacing Angular Material, the current theme system, `ngx-mat-timepicker`, and `ngx-quill` entirely.

The goal is a simpler, lighter dependency tree where all visual styling comes from DaisyUI's utility classes and theme tokens, eliminating the overhead of Angular Material's overlay portal system, CDK, and its own theming pipeline.

---

## 2. Goals

1. Install DaisyUI and configure it as a Tailwind CSS plugin (Tailwind v3, current version).
2. Replace Angular Material's theme system with DaisyUI's native `data-theme` attribute system, supporting at minimum **light** and **dark** modes, preserving the existing runtime switcher UX.
3. Replace all 15 form components (input, textarea, radio-group, checkbox, select, multi-select, autocomplete, date-picker, time-picker, color-picker, file-upload, dropzone, tags-input, wysiwyg) with DaisyUI-styled equivalents, rebuilding any overlay/dropdown behavior in pure Angular (signals + CDK-free).
4. Replace the entire layout shell (sidebar, navbar, breadcrumb, footer, dropdowns) with DaisyUI classes.
5. Remove `@angular/material`, `@angular/cdk`, `ngx-mat-timepicker`, and `ngx-quill` from `package.json` with zero remaining imports.
6. Replace `ngx-quill` with **Tiptap** (headless, framework-agnostic rich-text editor) styled with DaisyUI classes.
7. All existing unit tests must remain green after migration. New behavior introduced by component rewrites must be covered by tests.

---

## 3. User Stories

- **As a developer**, I want all UI components to use DaisyUI classes so I can style and customize them without fighting Angular Material's encapsulated styles.
- **As a developer**, I want the theme switcher to use DaisyUI's `data-theme` attribute so light/dark mode works out of the box with a single attribute change on `<html>`.
- **As an end user**, I want the app's visual appearance and behavior to feel the same after the migration — same layout, same component interactions, same theming.
- **As a developer**, I want a single lightweight rich-text editor (Tiptap) that integrates cleanly with Angular without a heavy Angular-specific wrapper package.

---

## 4. Functional Requirements

### 4.1 DaisyUI Installation & Configuration

1. Install `daisyui` as a dev dependency (`pnpm add -D daisyui`).
2. Register DaisyUI as a Tailwind plugin in `tailwind.config.js`.
3. Configure at least two DaisyUI themes: `light` and `dark`. Define custom theme tokens in `tailwind.config.js` to match the existing brand colors (primary, secondary, accent, neutral, base).
4. Remove all Angular Material theme imports from `styles.css` / `angular.json`.

### 4.2 Theme System Replacement

5. The `ThemeService` must switch themes by setting `document.documentElement.setAttribute('data-theme', themeName)` instead of toggling CSS classes.
6. The selected theme name must be persisted in `localStorage` under the key `theme` and restored on app load.
7. The theme switcher UI (currently in the navbar) must continue to work, offering at minimum light and dark options. The exact set of named color themes (blue, emerald, violet, amber, slate) may be reduced to light/dark for this migration — any additional themes are a non-goal (see section 5).
8. Remove all custom CSS variable declarations that were introduced to support the old theme system (`--color-primary`, etc.) and replace references with DaisyUI's semantic variables (`oklch` tokens via `data-theme`).

### 4.3 Form Components (all 15)

Each component must:
- Remain a standalone Angular component with OnPush change detection.
- Continue to implement `ControlValueAccessor` (CVA) where applicable, using the same injection pattern (`NgControl`, no `NG_VALUE_ACCESSOR` token).
- Use DaisyUI utility classes (`input`, `select`, `checkbox`, `radio`, `textarea`, `badge`, `btn`, `dropdown`, etc.) instead of Material/Tailwind custom classes.
- Apply DaisyUI's `input-error` / `select-error` / `textarea-error` modifier class when the bound form control is invalid and touched (replacing current `border-danger` logic).
- Accept the same `size` input (`sm` / `md` / `lg`) mapped to DaisyUI size modifiers (`input-sm`, `input-md`, `input-lg`).

Specific requirements per component:

9. **FormInputComponent** — use `<input class="input">` with DaisyUI modifiers. Retain password show/hide toggle, prefix/suffix slots.
10. **FormTextareaComponent** — use `<textarea class="textarea">`. Retain `autoResize` logic.
11. **FormRadioGroupComponent** — use `<input type="radio" class="radio">` per option. Retain orientation (horizontal/vertical).
12. **FormCheckboxComponent** — use `<input type="checkbox" class="checkbox">`. Retain `indeterminate` support via `@ViewChild`.
13. **FormSelectComponent** — replace `mat-select` with a custom Angular dropdown built using DaisyUI `dropdown` + `menu` classes. Must support static `Option[]` and `Observable<Option[]>` options. Retain `placeholder`.
14. **FormMultiSelectComponent** — same custom dropdown approach; selected items rendered as DaisyUI `badge` chips with remove button. Retain `maxSelections` guard.
15. **FormAutocompleteComponent** — replace `mat-autocomplete` with a custom input + dropdown list (DaisyUI `dropdown` + `menu`). Retain client-side filter for static options, `search` EventEmitter for Observable options.
16. **FormDatePickerComponent** — replace `mat-datepicker` with `<input type="date">` styled with DaisyUI `input` class. Remove `MatNativeDateModule` dependency. Retain `min` / `max` inputs.
17. **FormTimePickerComponent** — replace `ngx-mat-timepicker` with `<input type="time">` styled with DaisyUI `input` class. Retain `format: 12 | 24` input (use `step` attribute and display format accordingly). Remove `NgxMatTimepickerModule`.
18. **FormColorPickerComponent** — use `<input type="color">` with a DaisyUI-styled swatch button trigger. No change in behavior.
19. **FileUploadComponent** — restyle trigger button with DaisyUI `btn`. No behavior change.
20. **DropzoneComponent** — restyle zone with DaisyUI `border-dashed` utility + `bg-base-200` on drag-over. No behavior change.
21. **FormTagsInputComponent** — restyle chips as DaisyUI `badge`, suggestion dropdown as DaisyUI `dropdown` + `menu`. No behavior change.
22. **WysiwygComponent** — replace `ngx-quill` with **Tiptap** (`@tiptap/core`, `@tiptap/starter-kit`). The component must remain a CVA binding to an HTML string. The Tiptap editor toolbar must be rendered with DaisyUI `btn` and `btn-group` classes. The editor content area must be styled with DaisyUI `prose` class (requires `@tailwindcss/typography`). Retain `placeholder`, `disabled`, and error-border behavior.

### 4.4 Layout Shell

23. **Sidebar** — replace any Material-specific classes with DaisyUI `menu`, `menu-item`, `drawer` utilities. Retain collapsible behavior (wide ↔ mini), mobile drawer, and tooltip-on-mini behavior (use native `title` attribute or a lightweight CSS tooltip, not `matTooltip`).
24. **Navbar (top bar)** — replace Material components with DaisyUI `navbar`, `btn`, `dropdown`. Retain search, theme switcher, notifications bell, profile dropdown.
25. **Notifications dropdown** — use DaisyUI `dropdown` + `menu`. No behavior change.
26. **Profile dropdown** — use DaisyUI `dropdown` + `menu`. No behavior change.
27. **Breadcrumb** — use DaisyUI `breadcrumbs` component class. Retain auto-generation from route `data.breadcrumb`.
28. **Footer** — restyle with DaisyUI `footer` class if applicable.
29. **Theme switcher** — update to set `data-theme` instead of toggling CSS classes.

### 4.5 Dependency Cleanup

30. Remove `@angular/material` and `@angular/cdk` from `package.json` and all imports across the codebase.
31. Remove `ngx-mat-timepicker` from `package.json` and all imports.
32. Remove `ngx-quill` and `quill` from `package.json` and all imports.
33. Remove `lucide-angular` icons that were only used for Material integration (e.g., `Calendar` toggle for `mat-datepicker`). Retain all other Lucide icons currently in use.
34. Install Tiptap packages: `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`.
35. Install `@tailwindcss/typography` for Tiptap prose styling.

### 4.6 Dev Demo Page

36. Update `DevFormsComponent` (`/dev/forms`) to reflect the migrated components and remove any Material-specific imports (`MatNativeDateModule`, `NgxMatTimepickerModule`, `QuillModule`).

---

## 5. Non-Goals (Out of Scope)

- Supporting the five named color themes (blue, emerald, violet, amber, slate) — light and dark only for this migration. Custom color themes can be a follow-up PRD.
- Building an animation/transition system equivalent to Angular Material's ripple or elevation effects.
- E2E (Cypress) test updates — unit tests only.
- Migrating feature pages (dashboard, users, audits, etc.) beyond the shared layout shell and form components.
- Accessibility (ARIA) auditing beyond what DaisyUI provides by default.

---

## 6. Design Considerations

- DaisyUI's semantic color names (`primary`, `secondary`, `accent`, `neutral`, `base-100`, `base-200`, `base-300`, `error`) should map to the existing design intent. Define the light and dark themes in `tailwind.config.js` using DaisyUI's `themes` array with explicit color values.
- The `error` DaisyUI token replaces the current `danger` semantic token for validation states. All `*-error` DaisyUI modifier classes replace `border-danger`/`text-danger` in templates.
- DaisyUI's `dropdown` component uses CSS (`focus-within` / `:has()`) for open/close by default, but for Angular-controlled state (e.g., keyboard navigation, close-on-outside-click), use `[open]` binding or a signal-driven class toggle.
- Tiptap is headless — it provides no default styles. All toolbar and editor-area styling is our responsibility via DaisyUI classes.

---

## 7. Technical Considerations

- **Tailwind version**: The project is on Tailwind v3. DaisyUI v4 requires Tailwind v4. Therefore install **DaisyUI v3** (`pnpm add -D daisyui@3`) to stay compatible with the current Tailwind setup.
- **Custom dropdowns**: Replacing `mat-select` and `mat-autocomplete` means rebuilding overlay positioning. Use a simple `position: absolute` dropdown inside a `position: relative` container (no CDK PortalOutlet needed). Handle close-on-outside-click with a host listener on `document:click`.
- **Tiptap + Angular**: Tiptap has no official Angular package. Integration is done by calling `new Editor({ element, extensions, content })` in `ngAfterViewInit` with a `@ViewChild` reference to the container element, and destroying the editor in `ngOnDestroy`. The `onUpdate` callback provides the HTML via `editor.getHTML()`.
- **CVA pattern unchanged**: No changes to the `NgControl` injection / `valueAccessor` assignment pattern across all form components.
- **Tree-shaking**: After removing Material, verify `pnpm build` produces no Material-related chunks.

---

## 8. Success Metrics

- Zero `@angular/material` or `@angular/cdk` imports remain in the codebase after migration.
- Zero `ngx-quill`, `quill`, or `ngx-mat-timepicker` imports remain.
- All existing unit tests pass (green suite).
- `pnpm build` completes with no errors and no Material-related bundle chunks.
- Light and dark themes visually match the existing design intent when toggled at runtime.
- The `/dev/forms` demo page renders all 15 components correctly in both themes.

---

## 9. Open Questions

- Should DaisyUI's `drawer` component replace the current mobile sidebar drawer implementation, or keep the existing Angular-driven drawer logic and just restyle it?
- For the custom `select` / `autocomplete` dropdowns, should we use `position: absolute` (simple, may clip inside overflow-hidden containers) or build a lightweight `position: fixed` positioner?
- Do any of the existing feature pages (dashboard, users, etc.) use Angular Material components directly? If so, those are out of scope for this PRD but will cause build errors when Material is removed — they need to be catalogued before work begins.
