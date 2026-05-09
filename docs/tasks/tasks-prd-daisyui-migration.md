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

- [ ] 2.0 Replace Theme System with DaisyUI `data-theme`
  - [ ] 2.1 Rewrite `ThemeService`
    - Open `src/app/shared/services/theme.service.ts`.
    - Change the theme-apply logic from toggling CSS classes on `<html>` to calling `document.documentElement.setAttribute('data-theme', themeName)`.
    - Change the localStorage key to `theme` (if different from current).
    - On service init, read `localStorage.getItem('theme')` and apply it; fall back to `'light'` if null.
    - Reduce the supported theme list to `['light', 'dark']`.
  - [ ] 2.2 Update `ThemeSwitcherComponent`
    - Open `theme-switcher.component.ts` and its HTML template.
    - Remove any reference to the five named color themes (blue, emerald, violet, amber, slate).
    - Restyle the switcher UI using DaisyUI `btn` and/or `dropdown` classes instead of any Material components.
    - Ensure clicking a theme option calls `ThemeService` with `'light'` or `'dark'`.
  - [ ] 2.3 Remove old CSS variable declarations from `styles.css`
    - Open `src/styles.css`.
    - Remove all `--color-primary`, `--color-secondary`, and other custom CSS variable blocks introduced for the old theme system.
    - Remove Angular Material `@import` or `@use` statements.
  - [ ] 2.4 Remove Angular Material styles from `angular.json`
    - Open `angular.json`.
    - Remove any Angular Material prebuilt theme CSS paths from the `styles` array (e.g., `node_modules/@angular/material/prebuilt-themes/...`).
  - [ ] 2.5 Update theme-switcher tests
    - Open `theme-switcher.component.spec.ts`.
    - Update assertions to verify `data-theme` is set (not CSS class toggled).
    - Verify only `light` and `dark` options are rendered.
    - Run `pnpm test` — confirm tests pass.

- [ ] 3.0 Migrate Simple Form Components to DaisyUI
  - [ ] 3.1 Update `form-size.utils.ts`
    - Open `src/app/shared/components/forms/utils/form-size.utils.ts`.
    - Update the size-class map so `sm → input-sm`, `md → input-md`, `lg → input-lg` (and equivalents for `textarea-*`, `select-*` if separate maps exist).
  - [ ] 3.2 Migrate `FormInputComponent`
    - Open `input.component.ts` and its template.
    - Replace existing input classes with DaisyUI `input input-bordered` (plus size modifier from `form-size.utils`).
    - Apply `input-error` when the bound control is invalid and touched (replacing `border-danger`).
    - Retain password show/hide toggle and prefix/suffix slot logic unchanged.
    - Update `input.component.spec.ts`: replace class assertions (`border-danger` → `input-error`).
    - Run `pnpm test` on this spec — confirm green.
  - [ ] 3.3 Migrate `FormTextareaComponent`
    - Replace classes with DaisyUI `textarea textarea-bordered` + size modifier.
    - Apply `textarea-error` for invalid+touched state.
    - Retain `autoResize` logic unchanged.
    - Update spec assertions and run tests.
  - [ ] 3.4 Migrate `FormRadioGroupComponent`
    - Replace each radio input's classes with DaisyUI `radio`.
    - Retain orientation (horizontal/vertical) logic.
    - Update spec and run tests.
  - [ ] 3.5 Migrate `FormCheckboxComponent`
    - Replace checkbox input classes with DaisyUI `checkbox`.
    - Retain `indeterminate` support via `@ViewChild`.
    - Update spec and run tests.
  - [ ] 3.6 Migrate `FormDatePickerComponent`
    - Remove `mat-datepicker`, `MatDatepickerModule`, `MatNativeDateModule` imports.
    - Replace template with `<input type="date" class="input input-bordered">` + size modifier.
    - Apply `input-error` for invalid+touched state.
    - Retain `min` / `max` input bindings (pass directly to native input).
    - Update spec (no Material mocks needed) and run tests.
  - [ ] 3.7 Migrate `FormTimePickerComponent`
    - Remove `NgxMatTimepickerModule` import.
    - Replace with `<input type="time" class="input input-bordered">` + size modifier.
    - Retain `format: 12 | 24` input: use `step` attribute and handle display accordingly.
    - Apply `input-error` for invalid+touched state.
    - Update spec and run tests.
  - [ ] 3.8 Migrate `FormColorPickerComponent`
    - Retain `<input type="color">` behavior.
    - Restyle the swatch/trigger button with DaisyUI `btn`.
    - Update spec and run tests.
  - [ ] 3.9 Migrate `FileUploadComponent`
    - Restyle the trigger button with DaisyUI `btn`.
    - No behavior changes.
    - Update spec and run tests.
  - [ ] 3.10 Migrate `DropzoneComponent`
    - Replace drag-over highlight classes with DaisyUI `border-dashed` utilities and `bg-base-200` on drag-over.
    - No behavior changes.
    - Update spec and run tests.
  - [ ] 3.11 Migrate `FormTagsInputComponent`
    - Restyle existing chips/tags as DaisyUI `badge badge-outline` with a remove `×` button.
    - Restyle suggestion dropdown as DaisyUI `dropdown` + `menu`.
    - No behavior changes (free-text and suggestion support unchanged).
    - Update spec and run tests.

- [ ] 4.0 Migrate Complex Form Components with Custom Dropdowns
  - [ ] 4.1 Build reusable dropdown shell pattern (document only, no abstraction)
    - Note the pattern to be repeated in select, multi-select, and autocomplete:
      - Wrapper `div` with `relative` class; dropdown panel with `absolute` positioning.
      - Signal `isOpen = signal(false)` controls `[class.hidden]` on the panel.
      - `@HostListener('document:click', ['$event'])` closes the dropdown when clicking outside the host element.
      - Keyboard: `ArrowDown` / `ArrowUp` navigate options; `Enter` selects; `Escape` closes.
  - [ ] 4.2 Migrate `FormSelectComponent`
    - Remove `mat-select`, `MatSelectModule` imports.
    - Rebuild template: a DaisyUI `btn` or `input`-styled trigger button showing the selected label, and a dropdown panel using DaisyUI `dropdown-content menu` classes.
    - Support both static `Option[]` and `Observable<Option[]>` options (async pipe in template).
    - Retain `placeholder` input (shown when no value selected).
    - Apply `select-error` border when invalid+touched.
    - Keep CVA wiring unchanged.
    - Update `select.component.spec.ts`: test open/close, option selection, outside-click close, and error state.
    - Run tests.
  - [ ] 4.3 Migrate `FormMultiSelectComponent`
    - Same custom dropdown approach as 4.2.
    - Selected items rendered as DaisyUI `badge` chips inside the trigger area, each with a remove button.
    - Retain `maxSelections` guard (disable options once limit reached).
    - Update spec and run tests.
  - [ ] 4.4 Migrate `FormAutocompleteComponent`
    - Remove `mat-autocomplete`, `MatAutocompleteModule` imports.
    - Rebuild: a DaisyUI `input input-bordered` that on input opens a dropdown (`dropdown-content menu`) filtered by typed text.
    - Retain client-side filter for static `Option[]` options.
    - Retain `search` EventEmitter for Observable options (emit on input change; consumer populates options).
    - Apply `input-error` for invalid+touched.
    - Update spec and run tests.

- [ ] 5.0 Replace WysiwygComponent: ngx-quill → Tiptap
  - [ ] 5.1 Install and verify Tiptap packages
    - Confirm `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder` are in `package.json` (installed in Task 1.3).
  - [ ] 5.2 Rewrite `WysiwygComponent` template and class
    - Open `wysiwyg.component.ts`.
    - Remove `QuillModule` import.
    - Add a `@ViewChild('editorContainer') editorEl: ElementRef` to reference the editor mount point.
    - In `ngAfterViewInit`: instantiate `new Editor({ element: this.editorEl.nativeElement, extensions: [StarterKit, Placeholder.configure({ placeholder: this.placeholder })], content: this._value, onUpdate: ({ editor }) => { this.onChange(editor.getHTML()); } })`.
    - In `ngOnDestroy`: call `this.editor.destroy()`.
    - Implement CVA: `writeValue` calls `editor.commands.setContent(value ?? '')`.
    - Template: toolbar buttons using DaisyUI `btn btn-sm` and `join` (button group) for Bold, Italic, Underline, Bullet list, Ordered list, Blockquote; editor mount `<div #editorContainer class="prose max-w-none">`.
    - Apply `border-error` ring on the container when control is invalid+touched.
    - Retain `placeholder`, `disabled` inputs (pass `disabled` to `editor.setEditable(false)`).
  - [ ] 5.3 Update `wysiwyg.component.spec.ts`
    - Mock the Tiptap `Editor` class (provide a jest/vitest spy or a stub object with `destroy`, `commands.setContent`, `getHTML`, `setEditable`).
    - Test: editor is created in `ngAfterViewInit`, destroyed in `ngOnDestroy`, `writeValue` calls `setContent`, `onUpdate` calls `onChange`.
    - Run `pnpm test` — confirm green.

- [ ] 6.0 Migrate Layout Shell to DaisyUI
  - [ ] 6.1 Migrate `SidebarComponent`
    - Open `sidebar.component.ts` and its template.
    - Replace Material-specific classes and imports with DaisyUI `menu`, `menu-title`, `li`, `a` structure.
    - Remove `matTooltip` directive; add native `title` attribute on icon anchors for mini-sidebar tooltip (or use a lightweight CSS tooltip via `tooltip` DaisyUI class if preferred).
    - Retain collapsible behavior (wide ↔ mini) and mobile drawer logic; just swap class names to DaisyUI equivalents.
  - [ ] 6.2 Migrate `NavItemComponent` and `NavGroupComponent`
    - Replace any Angular Material class references with DaisyUI menu item/group classes.
    - Ensure active state uses DaisyUI `active` class on `<li>` or `<a>`.
  - [ ] 6.3 Migrate `HeaderComponent` (top navbar)
    - Replace Material toolbar with DaisyUI `navbar` structure (`navbar-start`, `navbar-center`, `navbar-end`).
    - Restyle search input with DaisyUI `input input-bordered input-sm`.
    - Restyle hamburger button with DaisyUI `btn btn-ghost btn-square`.
    - Remove Material button/icon imports.
  - [ ] 6.4 Migrate `NotificationsDropdownComponent`
    - Replace Material menu/overlay with DaisyUI `dropdown dropdown-end` + `menu`.
    - Bell icon button: DaisyUI `btn btn-ghost btn-circle`.
    - Notification items: DaisyUI `menu` list items.
    - Update `notifications-dropdown.component.spec.ts` and run tests.
  - [ ] 6.5 Migrate `ProfileDropdownComponent`
    - Replace Material menu with DaisyUI `dropdown dropdown-end` + `menu`.
    - Avatar trigger: DaisyUI `btn btn-ghost btn-circle avatar`.
    - Update `profile-dropdown.component.spec.ts` and run tests.
  - [ ] 6.6 Migrate `BreadcrumbComponent`
    - Apply DaisyUI `breadcrumbs` class to the `<ul>` wrapper.
    - No behavior changes (auto-generation from route `data.breadcrumb` unchanged).
  - [ ] 6.7 Migrate `FooterComponent`
    - Apply DaisyUI `footer` class.
    - No behavior changes.
  - [ ] 6.8 Update `MainLayoutComponent`
    - Remove any remaining Angular Material module imports from `main-layout.component.ts`.
    - Update `main-layout.component.spec.ts` and run tests.

- [ ] 7.0 Remove Angular Material, CDK, and Legacy Dependencies
  - [ ] 7.1 Audit remaining Material/CDK imports across the codebase
    - Run `grep -r "@angular/material\|@angular/cdk\|ngx-mat-timepicker\|ngx-quill\|quill" src/ --include="*.ts"` to list any remaining imports.
    - For each hit in feature pages (dashboard, users, audits, etc.) that are out of scope: note the file and confirm it doesn't use Material components (if it does, it must be fixed or this migration is blocked — raise as an issue).
  - [ ] 7.2 Remove packages from `package.json`
    - Run `pnpm remove @angular/material @angular/cdk ngx-mat-timepicker ngx-quill quill`.
    - Verify they no longer appear in `package.json`.
  - [ ] 7.3 Remove any remaining Lucide icons used only for Material integration
    - Identify icons imported only for Material triggers (e.g., `Calendar` for `mat-datepicker` toggle).
    - Remove those icon imports from any component that no longer uses them.
    - Retain all other Lucide icons.
  - [ ] 7.4 Verify clean build
    - Run `pnpm build`.
    - Confirm: no errors, no Material-related chunks in the output bundle.
    - Run `pnpm test` — confirm full test suite is green.

- [ ] 8.0 Update Dev Demo Page and Final Verification
  - [ ] 8.1 Update `DevFormsComponent`
    - Open `dev-forms.component.ts`.
    - Remove imports of `MatNativeDateModule`, `NgxMatTimepickerModule`, `QuillModule` (and any other now-removed packages).
    - Ensure all 15 migrated form components are still demoed correctly.
    - Update any demo-specific template classes to DaisyUI equivalents if needed.
  - [ ] 8.2 Update `DevFormsComponent` spec
    - Open `dev-forms.component.spec.ts`.
    - Remove Material/legacy module declarations from `TestBed` setup.
    - Run `pnpm test` — confirm green.
  - [ ] 8.3 Manual visual verification checklist
    - Run `pnpm start` and navigate to `/dev/forms`.
    - Verify all 15 form components render correctly in light theme.
    - Switch to dark theme via the theme switcher — verify all components render correctly.
    - Verify the theme persists after a page reload (localStorage `theme` key is set).
    - Verify sidebar collapse/expand, mobile drawer, navbar dropdowns, breadcrumbs, and footer all render correctly in both themes.
  - [ ] 8.4 Final build and test gate
    - Run `pnpm build` — must complete with zero errors.
    - Run `pnpm test` — all tests must be green.
    - Run `grep -r "@angular/material\|@angular/cdk\|ngx-quill\|ngx-mat-timepicker" src/` — must return zero results.
