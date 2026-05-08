# PRD: Base Abstractions

## 1. Introduction / Overview

The Base Abstractions module provides the reusable inheritance foundation for all feature modules in the Strenik Dashboard. It solves the problem of duplicated boilerplate across feature pages — every CRUD page, data table, API service, modal, and form field would otherwise re-implement the same patterns independently.

This module introduces six abstract base classes and components that feature developers extend to get consistent behavior, state management, error handling, and UX patterns out of the box. It ships with a small set of stub implementations (e.g., a stub `UsersService`) to serve as reference examples.

---

## 2. Goals

1. Eliminate repeated boilerplate in CRUD feature pages by providing a single extensible base.
2. Enforce consistent patterns for API communication, loading states, error handling, and data display across all features.
3. Give developers a typed, generic foundation (`<T, TCreateDto, TUpdateDto, TQueryParams>`) that works for any entity.
4. Reduce time to implement a new CRUD feature page to under 30 minutes for a junior developer.
5. Ship stub example implementations alongside base classes so developers have a clear reference.

---

## 3. User Stories

- As a **feature developer**, I want to extend `BaseApiService` so that I only write entity-specific endpoint paths, not generic HTTP logic.
- As a **feature developer**, I want to extend `BaseCrudPage` so that my page gets loading states, item lists, and CRUD actions managed by Signals automatically.
- As a **feature developer**, I want to extend `BaseTableComponent` so that my table emits server-side pagination, sort, and filter events that my page component handles.
- As a **feature developer**, I want to extend `BaseModalComponent` so that my modal gets a consistent shell (header, body, footer) and open/close behavior.
- As a **feature developer**, I want to inject `ConfirmDialogService` so that I can trigger a confirmation dialog before any destructive action without rebuilding it per feature.
- As a **feature developer**, I want to extend `BaseFormFieldComponent` so that my input fields get consistent Angular Material wiring, error display, and label/hint rendering.

---

## 4. Functional Requirements

### 4.1 BaseApiService

1. Must be an `abstract class BaseApiService<T, TCreateDto, TUpdateDto, TQueryParams>` using Angular's `inject(HttpClient)`.
2. Must require subclasses to define a `protected abstract readonly endpoint: string` property.
3. Must provide the following concrete methods:
   - `getAll(params?: TQueryParams): Observable<T[]>`
   - `getById(id: string | number): Observable<T>`
   - `create(dto: TCreateDto): Observable<T>`
   - `update(id: string | number, dto: TUpdateDto): Observable<T>`
   - `delete(id: string | number): Observable<void>`
4. All methods must return typed Observables. No `any` types in public signatures.
5. Must not include interceptor logic — auth and error interceptors handle that at the HTTP layer.

### 4.2 BaseCrudPage

6. Must be an `abstract class BaseCrudPage<T>` (Angular component base, not decorated as `@Component`).
7. Must own the following internal state via Angular Signals:
   - `items = signal<T[]>([])`
   - `loading = signal<boolean>(false)`
   - `selectedItem = signal<T | null>(null)`
   - `error = signal<string | null>(null)`
8. Must provide the following lifecycle methods subclasses can override:
   - `abstract loadItems(): void` — called on init, must populate `items`.
   - `onCreateSuccess(item: T): void` — default: pushes item to `items`.
   - `onUpdateSuccess(updated: T): void` — default: replaces item in `items` by id.
   - `onDeleteSuccess(id: string | number): void` — default: removes item from `items`.
9. Must call `ConfirmDialogService.open()` before executing delete by default. Subclasses may override `confirmDelete()` to skip or customize.
10. Must implement `ngOnInit` to call `loadItems()`.

### 4.3 BaseTableComponent

11. Must be a standalone Angular `@Component` that subclasses extend.
12. Must define `@Input() data: T[] = []`, `@Input() loading = false`, `@Input() totalItems = 0`.
13. Must emit server-side events via `@Output()`:
    - `pageChange: EventEmitter<PageEvent>` (uses Angular Material `PageEvent`)
    - `sortChange: EventEmitter<Sort>` (uses Angular Material `Sort`)
    - `filterChange: EventEmitter<string>`
    - `rowSelect: EventEmitter<T[]>` (for multi-row selection)
14. Must not perform any pagination or sorting logic internally — all data manipulation is delegated to the parent (feature page).
15. Must render a loading skeleton state when `loading = true`.
16. Must render an empty state message when `data.length === 0` and `loading = false`.
17. Must support row selection (checkbox column) toggling bulk-select mode on/off.

### 4.4 BaseModalComponent

18. Must be a standalone Angular `@Component` providing a shell layout with header, scrollable body, and footer slots via `ng-content` with named selectors (`[modal-header]`, `[modal-body]`, `[modal-footer]`).
19. Must accept `@Input() title: string` for the default header title.
20. Must accept `@Input() isOpen = false` and emit `@Output() closed = new EventEmitter<void>()`.
21. Must close on backdrop click and on ESC key by default.
22. Must use Angular Material `MatDialog` as the underlying overlay mechanism when opened programmatically via a `BaseModalService.open(component)` helper.
23. Must support a `loading` input that disables action buttons in the footer while async operations are pending.

### 4.5 ConfirmDialogService

24. Must be a `@Injectable({ providedIn: 'root' })` service.
25. Must expose a single method: `open(config: ConfirmDialogConfig): Observable<boolean>`.
26. `ConfirmDialogConfig` must include: `title: string`, `message: string`, `confirmLabel?: string` (default: `'Confirm'`), `cancelLabel?: string` (default: `'Cancel'`), `danger?: boolean` (default: `false`) — applies danger/destructive styling to confirm button.
27. Must use Angular Material `MatDialog` internally.
28. Must return `Observable<boolean>` — `true` if confirmed, `false` if cancelled or dismissed.

### 4.6 BaseFormFieldComponent

29. Must be an `abstract class BaseFormFieldComponent` implementing `ControlValueAccessor`.
30. Must wrap Angular Material `mat-form-field` and render `matLabel`, `matHint`, and `mat-error` automatically.
31. Must accept `@Input()` for: `label: string`, `hint?: string`, `placeholder?: string`, `required?: boolean`, `readonly?: boolean`.
32. Must display validation error messages automatically from the bound `FormControl`'s `errors` object using a standard error message map (required, minlength, maxlength, email, pattern).
33. Must support custom error messages via `@Input() errorMessages: Record<string, string>` to override defaults.
34. Must propagate `disabled` state from the parent `FormControl` to the underlying Material input.

### 4.7 Stub Implementations

35. Must include a `StubUsersService extends BaseApiService<User, CreateUserDto, UpdateUserDto, UserQueryParams>` as a reference implementation with mock data (no real HTTP calls).
36. Must include a `StubUsersTableComponent extends BaseTableComponent<User>` showing minimal column definition.
37. Stub files must live under `src/app/core/abstractions/_stubs/` and be clearly marked with `// STUB — for reference only` comments.

---

## 5. Non-Goals (Out of Scope)

- Real HTTP integration — stubs use hardcoded mock data only.
- NgRx store integration — state is managed exclusively via Angular Signals in base classes.
- Drag-and-drop row reordering in the base table.
- Multi-step / wizard modal flows — base modal is single-step only.
- File upload handling inside base form fields — covered by the Form Components module.
- Internationalization of error messages.

---

## 6. Design Considerations

- All base classes and components live under `src/app/core/abstractions/`.
- File structure:
  ```
  src/app/core/abstractions/
    base-api.service.ts
    base-crud-page.ts
    base-table.component.ts
    base-modal.component.ts
    base-form-field.component.ts
    confirm-dialog.service.ts
    confirm-dialog/
      confirm-dialog.component.ts
    _stubs/
      stub-users.service.ts
      stub-users-table.component.ts
  ```
- All components must use `OnPush` change detection.
- All components must be standalone.
- Semantic color tokens only — no hardcoded Tailwind color utilities.
- Danger styling for `ConfirmDialogConfig.danger = true` uses `text-danger` / `bg-danger` tokens.

---

## 7. Technical Considerations

- `BaseApiService` uses `inject(HttpClient)` (not constructor injection) to stay compatible with standalone components.
- `BaseCrudPage` is not decorated with `@Component` — it is a plain abstract class. Feature page components apply their own `@Component` decorator and call `super()` in `ngOnInit`.
- `BaseTableComponent` uses Angular Material `MatTableModule`, `MatPaginatorModule`, `MatSortModule`, and `MatCheckboxModule`.
- `ConfirmDialogService` uses `inject(MatDialog)`.
- `BaseFormFieldComponent` uses `inject(NgControl, { optional: true, self: true })` to access the parent form control.
- All `TQueryParams` are typed as `Record<string, string | number | boolean | undefined>` compatible with `HttpParams`.

---

## 8. Success Metrics

- A new CRUD feature page can be scaffolded by extending `BaseCrudPage` and `BaseApiService` in under 30 minutes.
- Zero duplication of loading/error/selection state logic across feature pages.
- All base classes and stubs pass Vitest unit tests with >80% coverage.
- `ConfirmDialogService` is used in at least the Users and Products CRUD demo pages (confirmed in later PRDs).

---

## 9. Open Questions

- Should `BaseCrudPage` support optimistic updates (update UI before API response confirms), or always wait for API response?
- Should `BaseTableComponent` support column definitions via a typed config input, or leave column rendering entirely to the subclass template?
- Should the `BaseModalService.open()` helper be part of this PRD or deferred to the Shared UI Components PRD?
- Should stubs use Angular's `in-memory-web-api` or just synchronous `of(mockData)` observables?
