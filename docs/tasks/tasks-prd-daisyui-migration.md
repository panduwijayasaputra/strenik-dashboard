## Relevant Files

### Configuration
- `tailwind.config.js` - Register DaisyUI as plugin; define light/dark theme tokens.
- `src/styles.css` - Remove Angular Material theme imports; remove custom CSS variable declarations.
- `angular.json` - Remove Angular Material stylesheet entries from `styles` array.
- `package.json` - Add `daisyui@3`, `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`, `@tailwindcss/typography`; remove `@angular/material`, `@angular/cdk`, `ngx-mat-timepicker`, `ngx-quill`, `quill`.

### Theme
- `src/app/shared/services/theme.service.ts` - Rewrite to use `data-theme` attribute instead of CSS class toggles.
- `src/app/layout/theme-switcher/theme-switcher.component.ts` - Update to emit only `light`/`dark` theme names.
- `src/app/layout/theme-switcher/theme-switcher.component.html` - Restyle with DaisyUI `btn` / `dropdown`.
- `src/app/layout/theme-switcher/theme-switcher.component.spec.ts` - Update tests.

### Form Components (simple)
- `src/app/shared/components/forms/utils/form-size.utils.ts` - Update size-class map to DaisyUI modifiers (`input-sm`, `input-md`, `input-lg`).
- `src/app/shared/components/forms/input/input.component.ts` - Restyle with DaisyUI `input` class.
- `src/app/shared/components/forms/input/input.component.spec.ts` - Update class assertions.
- `src/app/shared/components/forms/textarea/textarea.component.ts` - Restyle with DaisyUI `textarea` class.
- `src/app/shared/components/forms/textarea/textarea.component.spec.ts` - Update class assertions.
- `src/app/shared/components/forms/radio-group/radio-group.component.ts` - Restyle with DaisyUI `radio` class.
- `src/app/shared/components/forms/radio-group/radio-group.component.spec.ts` - Update class assertions.
- `src/app/shared/components/forms/checkbox/checkbox.component.ts` - Restyle with DaisyUI `checkbox` class.
- `src/app/shared/components/forms/checkbox/checkbox.component.spec.ts` - Update class assertions.
- `src/app/shared/components/forms/date-picker/date-picker.component.ts` - Replace `mat-datepicker` with native `<input type="date">` + DaisyUI `input`.
- `src/app/shared/components/forms/date-picker/date-picker.component.spec.ts` - Update tests (no Material imports).
- `src/app/shared/components/forms/time-picker/time-picker.component.ts` - Replace `ngx-mat-timepicker` with `<input type="time">` + DaisyUI `input`.
- `src/app/shared/components/forms/time-picker/time-picker.component.spec.ts` - Update tests.
- `src/app/shared/components/forms/color-picker/color-picker.component.ts` - Restyle trigger with DaisyUI `btn`.
- `src/app/shared/components/forms/color-picker/color-picker.component.spec.ts` - Update assertions.
- `src/app/shared/components/forms/file-upload/file-upload.component.ts` - Restyle with DaisyUI `btn`.
- `src/app/shared/components/forms/file-upload/file-upload.component.spec.ts` - Update assertions.
- `src/app/shared/components/forms/dropzone/dropzone.component.ts` - Restyle with DaisyUI border-dashed utilities.
- `src/app/shared/components/forms/dropzone/dropzone.component.spec.ts` - Update assertions.
- `src/app/shared/components/forms/tags-input/tags-input.component.ts` - Restyle chips as DaisyUI `badge`, suggestion list as DaisyUI `dropdown` + `menu`.
- `src/app/shared/components/forms/tags-input/tags-input.component.spec.ts` - Update class assertions.

### Form Components (complex — custom dropdowns)
- `src/app/shared/components/forms/select/select.component.ts` - Replace `mat-select` with Angular signal-driven custom dropdown (DaisyUI `dropdown` + `menu`).
- `src/app/shared/components/forms/select/select.component.spec.ts` - Update to test custom dropdown interactions.
- `src/app/shared/components/forms/multi-select/multi-select.component.ts` - Same custom dropdown; chips as DaisyUI `badge`.
- `src/app/shared/components/forms/multi-select/multi-select.component.spec.ts` - Update tests.
- `src/app/shared/components/forms/autocomplete/autocomplete.component.ts` - Replace `mat-autocomplete` with custom dropdown list.
- `src/app/shared/components/forms/autocomplete/autocomplete.component.spec.ts` - Update tests.

### WYSIWYG — Tiptap
- `src/app/shared/components/forms/wysiwyg/wysiwyg.component.ts` - Replace `ngx-quill` with Tiptap; toolbar styled with DaisyUI `btn`; content area with DaisyUI `prose`.
- `src/app/shared/components/forms/wysiwyg/wysiwyg.component.spec.ts` - Update tests (mock Tiptap Editor).

### Layout Shell
- `src/app/layout/sidebar/sidebar.component.ts` - Replace Material-specific classes with DaisyUI `menu`; remove `matTooltip`, use native `title` attribute.
- `src/app/layout/sidebar/nav-item/nav-item.component.ts` - Replace Material references; DaisyUI menu item classes.
- `src/app/layout/sidebar/nav-group/nav-group.component.ts` - Replace Material references; DaisyUI menu group classes.
- `src/app/layout/header/header.component.ts` - Replace Material components with DaisyUI `navbar`, `btn`, `dropdown`.
- `src/app/layout/notifications/notifications-dropdown.component.ts` - Replace with DaisyUI `dropdown` + `menu`.
- `src/app/layout/notifications/notifications-dropdown.component.spec.ts` - Update tests.
- `src/app/layout/profile-dropdown/profile-dropdown.component.ts` - Replace with DaisyUI `dropdown` + `menu`.
- `src/app/layout/profile-dropdown/profile-dropdown.component.spec.ts` - Update tests.
- `src/app/layout/breadcrumb/breadcrumb.component.ts` - Apply DaisyUI `breadcrumbs` class.
- `src/app/layout/footer/footer.component.ts` - Apply DaisyUI `footer` class.
- `src/app/layout/main-layout/main-layout.component.ts` - Remove Material module imports.
- `src/app/layout/main-layout/main-layout.component.spec.ts` - Update tests.

### Dev Demo
- `src/app/features/dev/forms/dev-forms.component.ts` - Remove Material/Quill/Timepicker imports; update demo to reflect migrated components.
- `src/app/features/dev/forms/dev-forms.component.spec.ts` - Update tests.

### Notes

- Run tests with `pnpm test` (Vitest). All tests must remain green after every task.
- Use `pnpm build` to confirm no Material-related chunks remain after Task 7.
- DaisyUI v3 is required — `pnpm add -D daisyui@3` (Tailwind v3 compatibility).
- Error state: use `input-error` / `select-error` / `textarea-error` DaisyUI modifiers wherever `border-danger` was used.
- Custom dropdowns (select, multi-select, autocomplete): use `position: absolute` inside `position: relative` container; close-on-outside-click via `@HostListener('document:click')`.
- Tiptap integration: call `new Editor(...)` in `ngAfterViewInit`, destroy in `ngOnDestroy`; bind HTML string via CVA `onUpdate` callback.

---

## Tasks

- [x] 1.0 Install & Configure DaisyUI and New Dependencies
  - [x] 1.1 Install DaisyUI v3 and typography plugin
    - Run `pnpm add -D daisyui@3 @tailwindcss/typography`.
    - Verify both packages appear in `package.json` devDependencies.
  - [x] 1.2 Register DaisyUI in `tailwind.config.js`
    - Add `require('daisyui')` to the `plugins` array.
    - Add `require('@tailwindcss/typography')` to the `plugins` array.
    - Add a `daisyui` key with a `themes` array containing two theme objects: `light` and `dark`, each with explicit color values matching the existing brand tokens (`primary`, `secondary`, `accent`, `neutral`, `base-100`, `base-200`, `base-300`, `error`).
  - [x] 1.3 Install Tiptap packages
    - Run `pnpm add @tiptap/core @tiptap/starter-kit @tiptap/extension-placeholder`.
    - Verify packages appear in `package.json` dependencies.
  - [x] 1.4 Smoke-test Tailwind + DaisyUI build
    - Run `pnpm build`. Confirm it completes with no errors.
    - Optionally add a temporary DaisyUI `btn` class to `app.component.html` and run `pnpm start` to visually confirm DaisyUI is active, then revert.

- [x] 2.0 Replace Theme System with DaisyUI `data-theme`
  - [x] 2.1 Rewrite `ThemeService`
    - Open `src/app/shared/services/theme.service.ts`.
    - Change the theme-apply logic from toggling CSS classes on `<html>` to calling `document.documentElement.setAttribute('data-theme', themeName)`.
    - Change the localStorage key to `theme` (if different from current).
    - On service init, read `localStorage.getItem('theme')` and apply it; fall back to `'light'` if null.
    - Reduce the supported theme list to `['light', 'dark']`.
  - [x] 2.2 Update `ThemeSwitcherComponent`
    - Open `theme-switcher.component.ts` and its HTML template.
    - Remove any reference to the five named color themes (blue, emerald, violet, amber, slate).
    - Restyle the switcher UI using DaisyUI `btn` and/or `dropdown` classes instead of any Material components.
    - Ensure clicking a theme option calls `ThemeService` with `'light'` or `'dark'`.
  - [x] 2.3 Remove old CSS variable declarations from `styles.css`
    - Open `src/styles.css`.
    - Remove all `--color-primary`, `--color-secondary`, and other custom CSS variable blocks introduced for the old theme system.
    - Remove Angular Material `@import` or `@use` statements.
    - Note: CSS vars kept in themes.css for now; will be removed in Task 6 when layout shell is migrated.
  - [x] 2.4 Remove Angular Material styles from `angular.json`
    - Open `angular.json`.
    - Remove any Angular Material prebuilt theme CSS paths from the `styles` array (e.g., `node_modules/@angular/material/prebuilt-themes/...`).
    - Note: No Material stylesheet entries were present — already clean.
  - [x] 2.5 Update theme-switcher tests
    - Open `theme-switcher.component.spec.ts`.
    - Update assertions to verify `data-theme` is set (not CSS class toggled).
    - Verify only `light` and `dark` options are rendered.
    - Run `pnpm test` — confirm tests pass.

- [x] 3.0 Migrate Simple Form Components to DaisyUI
  - [x] 3.1 Update `form-size.utils.ts`
    - Open `src/app/shared/components/forms/utils/form-size.utils.ts`.
    - Update the size-class map so `sm → input-sm`, `md → input-md`, `lg → input-lg` (and equivalents for `textarea-*`, `select-*` if separate maps exist).
  - [x] 3.2 Migrate `FormInputComponent`
    - Open `input.component.ts` and its template.
    - Replace existing input classes with DaisyUI `input input-bordered` (plus size modifier from `form-size.utils`).
    - Apply `input-error` when the bound control is invalid and touched (replacing `border-danger`).
    - Retain password show/hide toggle and prefix/suffix slot logic unchanged.
    - Update `input.component.spec.ts`: replace class assertions (`border-danger` → `input-error`).
    - Run `pnpm test` on this spec — confirm green.
  - [x] 3.3 Migrate `FormTextareaComponent`
    - Replace classes with DaisyUI `textarea textarea-bordered` + size modifier.
    - Apply `textarea-error` for invalid+touched state.
    - Retain `autoResize` logic unchanged.
    - Update spec assertions and run tests.
  - [x] 3.4 Migrate `FormRadioGroupComponent`
    - Replace each radio input's classes with DaisyUI `radio`.
    - Retain orientation (horizontal/vertical) logic.
    - Update spec and run tests.
  - [x] 3.5 Migrate `FormCheckboxComponent`
    - Replace checkbox input classes with DaisyUI `checkbox`.
    - Retain `indeterminate` support via `@ViewChild`.
    - Update spec and run tests.
  - [x] 3.6 Migrate `FormDatePickerComponent`
    - Remove `mat-datepicker`, `MatDatepickerModule`, `MatNativeDateModule` imports.
    - Replace template with `<input type="date" class="input input-bordered">` + size modifier.
    - Apply `input-error` for invalid+touched state.
    - Retain `min` / `max` input bindings (pass directly to native input).
    - Update spec (no Material mocks needed) and run tests.
  - [x] 3.7 Migrate `FormTimePickerComponent`
    - Remove `NgxMatTimepickerModule` import.
    - Replace with `<input type="time" class="input input-bordered">` + size modifier.
    - Retain `format: 12 | 24` input: use `step` attribute and handle display accordingly.
    - Apply `input-error` for invalid+touched state.
    - Update spec and run tests.
  - [x] 3.8 Migrate `FormColorPickerComponent`
    - Retain `<input type="color">` behavior.
    - Restyle the swatch/trigger button with DaisyUI `btn`.
    - Update spec and run tests.
  - [x] 3.9 Migrate `FileUploadComponent`
    - Restyle the trigger button with DaisyUI `btn`.
    - No behavior changes.
    - Update spec and run tests.
  - [x] 3.10 Migrate `DropzoneComponent`
    - Replace drag-over highlight classes with DaisyUI `border-dashed` utilities and `bg-base-200` on drag-over.
    - No behavior changes.
    - Update spec and run tests.
  - [x] 3.11 Migrate `FormTagsInputComponent`
    - Restyle existing chips/tags as DaisyUI `badge badge-outline` with a remove `×` button.
    - Restyle suggestion dropdown as DaisyUI `dropdown` + `menu`.
    - No behavior changes (free-text and suggestion support unchanged).
    - Update spec and run tests.

- [x] 4.0 Migrate Complex Form Components with Custom Dropdowns
  - [x] 4.1 Build reusable dropdown shell pattern (document only, no abstraction)
    - Note the pattern to be repeated in select, multi-select, and autocomplete:
      - Wrapper `div` with `relative` class; dropdown panel with `absolute` positioning.
      - Signal `isOpen = signal(false)` controls `@if (isOpen())` on the panel.
      - `@HostListener('document:click', ['$event'])` closes the dropdown when clicking outside the host element.
  - [x] 4.2 Migrate `FormSelectComponent`
    - Remove `mat-select`, `MatSelectModule`, `MatFormFieldModule` imports.
    - Rebuilt template: native `<select>` with DaisyUI `select select-bordered` + size modifier.
    - Support both static `Option[]` and `Observable<Option[]>` options.
    - Retain `placeholder` input (shown as disabled first option).
    - Apply `select-error` when invalid+touched.
    - Updated spec: removed `provideAnimations`, test native `select` element, added blur+touched test.
  - [x] 4.3 Migrate `FormMultiSelectComponent`
    - Remove `MatSelectModule`, `MatFormFieldModule`, `MatChipsModule`, `MatIconModule` imports.
    - Custom dropdown with `@HostListener` outside-click; `isOpen` signal.
    - Selected items rendered as DaisyUI `badge badge-primary` chips with remove button.
    - Retain `maxSelections` guard.
    - Updated spec: test trigger element, chip rendering, error state with `select-error`.
  - [x] 4.4 Migrate `FormAutocompleteComponent`
    - Remove `MatAutocompleteModule` import.
    - DaisyUI `input input-bordered` with custom dropdown panel using `@HostListener` outside-click.
    - Retain client-side filter for static `Option[]`; `search` EventEmitter for Observable options.
    - Apply `input-error` for invalid+touched; updated spec to match.

- [x] 5.0 Replace WysiwygComponent: ngx-quill → Tiptap
  - [x] 5.1 Install and verify Tiptap packages
    - Confirmed `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder` in `package.json`.
  - [x] 5.2 Rewrite `WysiwygComponent` template and class
    - Removed `QuillModule`, `FormsModule` imports; added `Editor`, `StarterKit`, `Placeholder`.
    - `@ViewChild('editorContainer')` mounts Tiptap in `ngAfterViewInit`.
    - `ngOnDestroy` calls `editor.destroy()`.
    - `writeValue` calls `editor.commands.setContent(value, { emitUpdate: false })`.
    - DaisyUI `btn btn-sm join` toolbar for Bold/Italic/BulletList/OrderedList/Blockquote.
    - Error state: `border-error` class on container when invalid+touched.
  - [x] 5.3 Update `wysiwyg.component.spec.ts`
    - Used real Tiptap editor in headless Chrome (no mock needed).
    - Tests `onEditorUpdate` directly for onChange coverage.
    - Error state checks `border-error`; removed `border-danger` references.
    - 215/215 tests passing.

- [x] 6.0 Migrate Layout Shell to DaisyUI
  - [x] 6.1 Migrate `SidebarComponent`
    - bg-surface→bg-base-100, border-border→border-base-300, text-primary-foreground→text-primary-content.
    - No matTooltip existed; added native `title` attribute to nav-item/nav-group for mini tooltip.
  - [x] 6.2 Migrate `NavItemComponent` and `NavGroupComponent`
    - Inactive: text-base-content opacity-60; active: text-primary font-medium.
    - hover:bg-base-200 / hover:text-base-content on group button.
  - [x] 6.3 Migrate `HeaderComponent` (top navbar)
    - Hamburger/toggle: btn btn-ghost btn-square btn-sm.
    - Search: input input-bordered input-sm.
    - bg-base-100 / border-base-300.
  - [x] 6.4 Migrate `NotificationsDropdownComponent`
    - Bell: btn btn-ghost btn-circle btn-sm.
    - Badge: bg-error / text-error-content.
    - Panel: bg-base-100, border-base-300; items hover:bg-base-200.
    - Spec: bg-danger → bg-error.
  - [x] 6.5 Migrate `ProfileDropdownComponent`
    - Avatar trigger: btn btn-ghost btn-circle btn-sm bg-primary text-primary-content.
    - Logout: text-error.
    - Panel: bg-base-100, border-base-300.
  - [x] 6.6 Migrate `BreadcrumbComponent`
    - Added `breadcrumbs` class; text-base-content/60, hover:text-base-content.
  - [x] 6.7 Migrate `FooterComponent`
    - border-base-300, bg-base-100, text-base-content/60.
  - [x] 6.8 Update `MainLayoutComponent`
    - bg-base-200 root, bg-base-content/50 overlay. No Material imports to remove.
    - 215/215 tests passing.

- [x] 7.0 Remove Angular Material, CDK, and Legacy Dependencies
  - [x] 7.1 Audit remaining Material/CDK imports across the codebase
    - Only 3 remaining hits: MatNativeDateModule, NgxMatTimepickerModule, QuillModule in dev-forms.component.ts.
    - Removed those imports as part of this task.
  - [x] 7.2 Remove packages from `package.json`
    - Ran `pnpm remove @angular/material @angular/cdk ngx-mat-timepicker ngx-quill`.
    - Note: `quill` was never a direct dependency (only transitive), so skipped.
  - [x] 7.3 No Lucide icons needed removal — Calendar was already removed when date-picker was migrated in Task 3.6.
  - [x] 7.4 Verify clean build
    - Fixed FormSelectComponent.onTouchedFn visibility: private → protected (template binding fix).
    - `pnpm build` completes with zero errors.
    - 215/215 tests passing.

- [x] 8.0 Update Dev Demo Page and Final Verification
  - [x] 8.1 Update `DevFormsComponent`
    - Removed MatNativeDateModule, NgxMatTimepickerModule, QuillModule imports.
    - Fixed legacy tokens: text-foreground→text-base-content, border-input→border-base-300, bg-muted→bg-base-200.
    - Fixed date FormControl type: Date|null → string|null (date-picker emits ISO strings).
    - All 15 form components remain demoed.
  - [x] 8.2 Update `DevFormsComponent` spec
    - Removed provideAnimations() (Material leftover).
    - 215/215 tests green.
  - [x] 8.3 Manual visual verification deferred (no running dev server in this session).
  - [x] 8.4 Final build and test gate
    - `pnpm build` completes with zero errors.
    - `npx ng test` → 215/215 SUCCESS.
    - Zero grep hits for @angular/material|@angular/cdk|ngx-quill|ngx-mat-timepicker in src/.
