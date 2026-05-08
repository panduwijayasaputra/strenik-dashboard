# Tasks: Base Abstractions

Based on: `docs/prd/prd-base-abstractions.md`

## Relevant Files

### New Files
- `src/app/core/abstractions/base-api.service.ts` - Abstract generic API service base class.
- `src/app/core/abstractions/base-api.service.spec.ts` - Unit tests for BaseApiService.
- `src/app/core/abstractions/base-crud-page.ts` - Abstract base class for CRUD feature pages.
- `src/app/core/abstractions/base-crud-page.spec.ts` - Unit tests for BaseCrudPage.
- `src/app/core/abstractions/base-table.component.ts` - Abstract base table component.
- `src/app/core/abstractions/base-table.component.spec.ts` - Unit tests for BaseTableComponent.
- `src/app/core/abstractions/base-modal.component.ts` - Generic modal shell component.
- `src/app/core/abstractions/base-modal.component.spec.ts` - Unit tests for BaseModalComponent.
- `src/app/core/abstractions/base-form-field.component.ts` - Abstract ControlValueAccessor base for form fields.
- `src/app/core/abstractions/base-form-field.component.spec.ts` - Unit tests for BaseFormFieldComponent.
- `src/app/core/abstractions/confirm-dialog.service.ts` - Service to open confirmation dialogs.
- `src/app/core/abstractions/confirm-dialog.service.spec.ts` - Unit tests for ConfirmDialogService.
- `src/app/core/abstractions/confirm-dialog/confirm-dialog.component.ts` - Angular Material dialog component for confirmations.
- `src/app/core/abstractions/confirm-dialog/confirm-dialog.component.spec.ts` - Unit tests for ConfirmDialogComponent.
- `src/app/core/abstractions/models/base.models.ts` - Shared interfaces and DTOs used across abstractions.
- `src/app/core/abstractions/index.ts` - Barrel export for all abstractions.
- `src/app/core/abstractions/_stubs/stub-users.service.ts` - Reference stub extending BaseApiService.
- `src/app/core/abstractions/_stubs/stub-users-table.component.ts` - Reference stub extending BaseTableComponent.

### Notes

- Unit tests use Vitest and should be placed alongside the source file.
- Run tests with `pnpm test` or `pnpm vitest run`.
- All components must be standalone with `OnPush` change detection.
- Use semantic color tokens only — never hardcode Tailwind colors.

## Tasks

- [x] 1.0 Scaffold abstractions directory structure and shared type definitions
  - [x] 1.1 Create the `src/app/core/abstractions/` directory with placeholder files
    - Create the folder structure as listed in Relevant Files above.
    - Create `src/app/core/abstractions/models/base.models.ts` with the following shared types:
      - `PageEvent` re-exported from Angular Material (or typed locally if not using Material's directly).
      - `ConfirmDialogConfig` interface: `{ title: string; message: string; confirmLabel?: string; cancelLabel?: string; danger?: boolean; }`.
      - `SortEvent` interface wrapping Angular Material `Sort`: `{ active: string; direction: 'asc' | 'desc' | ''; }`.
      - `BaseQueryParams` type: `Record<string, string | number | boolean | undefined>`.
    - Create `src/app/core/abstractions/index.ts` as an empty barrel file for now.

- [ ] 2.0 Implement BaseApiService
  - [x] 2.1 Create the abstract `BaseApiService` class with full generics
    - In `src/app/core/abstractions/base-api.service.ts`, create:
      ```ts
      export abstract class BaseApiService<T, TCreateDto, TUpdateDto, TQueryParams extends BaseQueryParams = BaseQueryParams>
      ```
    - Use `inject(HttpClient)` for HTTP access (no constructor injection).
    - Declare `protected abstract readonly endpoint: string`.
    - Implement `getAll(params?: TQueryParams): Observable<T[]>` — builds `HttpParams` from the params object and calls `GET /endpoint`.
    - Implement `getById(id: string | number): Observable<T>` — calls `GET /endpoint/:id`.
    - Implement `create(dto: TCreateDto): Observable<T>` — calls `POST /endpoint`.
    - Implement `update(id: string | number, dto: TUpdateDto): Observable<T>` — calls `PUT /endpoint/:id`.
    - Implement `delete(id: string | number): Observable<void>` — calls `DELETE /endpoint/:id`.
    - All methods must have fully typed signatures — no `any`.
  - [x] 2.2 Write unit tests for BaseApiService
    - In `base-api.service.spec.ts`, create a concrete test subclass (e.g., `TestApiService extends BaseApiService<User, CreateUserDto, UpdateUserDto>`).
    - Use `HttpClientTestingModule` and `HttpTestingController` to intercept and verify HTTP calls.
    - Test: `getAll()` sends `GET` to correct URL; with params, appends query string.
    - Test: `getById(id)` sends `GET` to `/endpoint/id`.
    - Test: `create(dto)` sends `POST` with correct body.
    - Test: `update(id, dto)` sends `PUT` to `/endpoint/id` with body.
    - Test: `delete(id)` sends `DELETE` to `/endpoint/id`.

- [ ] 3.0 Implement ConfirmDialogService and ConfirmDialogComponent
  - [ ] 3.1 Create ConfirmDialogComponent
    - In `confirm-dialog/confirm-dialog.component.ts`, create a standalone `@Component` with `OnPush`.
    - Inject `MAT_DIALOG_DATA` to receive `ConfirmDialogConfig`.
    - Inject `MatDialogRef<ConfirmDialogComponent>` to close the dialog.
    - Template: render `config.title` as the dialog title, `config.message` as body text.
    - Footer buttons: cancel button calls `dialogRef.close(false)`; confirm button calls `dialogRef.close(true)`.
    - When `config.danger === true`, apply `text-danger` or `bg-danger` semantic token classes to the confirm button.
    - Default `confirmLabel` to `'Confirm'` and `cancelLabel` to `'Cancel'` if not provided.
    - Import `MatDialogModule`, `MatButtonModule`.
  - [ ] 3.2 Create ConfirmDialogService
    - In `confirm-dialog.service.ts`, create `@Injectable({ providedIn: 'root' })`.
    - Inject `MatDialog`.
    - Implement `open(config: ConfirmDialogConfig): Observable<boolean>`:
      - Calls `this.dialog.open(ConfirmDialogComponent, { data: config, width: '400px', disableClose: false })`.
      - Returns `dialogRef.afterClosed().pipe(map(result => result === true))` to always emit a boolean.
  - [ ] 3.3 Write unit tests for ConfirmDialogService and ConfirmDialogComponent
    - Test `ConfirmDialogService.open()`: verify `MatDialog.open` is called with correct component and data.
    - Test that `afterClosed()` returning `true` maps to `Observable<true>`.
    - Test that `afterClosed()` returning `undefined` (dismissed) maps to `Observable<false>`.
    - Test `ConfirmDialogComponent`: confirm button emits `true`, cancel button emits `false`.
    - Test that `danger: true` applies the danger CSS class to the confirm button.

- [ ] 4.0 Implement BaseCrudPage
  - [ ] 4.1 Create the abstract `BaseCrudPage` class
    - In `base-crud-page.ts`, create a plain abstract class (no `@Component` decorator).
    - Inject `ConfirmDialogService` using `inject()`.
    - Declare internal Signals:
      - `items = signal<T[]>([])`
      - `loading = signal<boolean>(false)`
      - `selectedItem = signal<T | null>(null)`
      - `error = signal<string | null>(null)`
    - Declare `abstract loadItems(): void`.
    - Implement `ngOnInit()`: sets `loading(true)`, calls `loadItems()`.
    - Implement `onCreateSuccess(item: T): void`: updates `items` signal by appending the new item.
    - Implement `onUpdateSuccess(updated: T): void`: replaces the matching item in `items` by comparing an `id` field. Use a generic constraint `T extends { id: string | number }` or a protected `abstract getItemId(item: T): string | number` method.
    - Implement `onDeleteSuccess(id: string | number): void`: filters out the item with the matching id from `items`.
    - Implement `confirmDelete(id: string | number): Observable<boolean>`: calls `ConfirmDialogService.open({ title: 'Delete', message: 'Are you sure?', danger: true })`.
    - Feature pages call `confirmDelete(id).subscribe(confirmed => { if (confirmed) this.deleteItem(id); })`.
    - Declare `protected abstract deleteItem(id: string | number): void` for feature pages to implement.
  - [ ] 4.2 Write unit tests for BaseCrudPage
    - Create a concrete test subclass implementing `loadItems()` and `deleteItem()`.
    - Test: `ngOnInit` calls `loadItems()` and sets `loading` to `true`.
    - Test: `onCreateSuccess(item)` appends item to `items` signal.
    - Test: `onUpdateSuccess(updated)` replaces the correct item in `items`.
    - Test: `onDeleteSuccess(id)` removes the correct item from `items`.
    - Test: `confirmDelete(id)` calls `ConfirmDialogService.open()` with `danger: true`.

- [ ] 5.0 Implement BaseTableComponent
  - [ ] 5.1 Create the `BaseTableComponent` standalone component
    - In `base-table.component.ts`, create a standalone `@Component` with `OnPush`.
    - Declare inputs:
      - `@Input() data: T[] = []`
      - `@Input() loading = false`
      - `@Input() totalItems = 0`
      - `@Input() pageSize = 10`
      - `@Input() pageIndex = 0`
    - Declare outputs:
      - `@Output() pageChange = new EventEmitter<PageEvent>()`
      - `@Output() sortChange = new EventEmitter<Sort>()`
      - `@Output() filterChange = new EventEmitter<string>()`
      - `@Output() rowSelect = new EventEmitter<T[]>()`
    - Template: render `<mat-table>`, `<mat-paginator>`, `<mat-sort>`. Use `ng-content` with named slots (`[table-columns]`) for column definitions so subclasses inject their own column templates.
    - When `loading === true`: show a skeleton loader (e.g., repeated placeholder rows using `@for`).
    - When `loading === false` and `data.length === 0`: show an empty state message slot via `ng-content select="[empty-state]"` (with a default "No data available" fallback).
    - Include a checkbox column for row selection; toggling "select all" emits all rows via `rowSelect`.
    - Import: `MatTableModule`, `MatPaginatorModule`, `MatSortModule`, `MatCheckboxModule`.
  - [ ] 5.2 Write unit tests for BaseTableComponent
    - Test: renders rows equal to `data.length`.
    - Test: `loading = true` shows skeleton, hides table rows.
    - Test: `data = []` and `loading = false` shows empty state.
    - Test: paginator change event emits `pageChange`.
    - Test: sort header change emits `sortChange`.
    - Test: selecting all rows emits all items via `rowSelect`.

- [ ] 6.0 Implement BaseModalComponent and BaseFormFieldComponent
  - [ ] 6.1 Create the `BaseModalComponent` standalone component
    - In `base-modal.component.ts`, create a standalone `@Component` with `OnPush`.
    - Inputs:
      - `@Input() title = ''`
      - `@Input() isOpen = false`
      - `@Input() loading = false`
    - Output:
      - `@Output() closed = new EventEmitter<void>()`
    - Template: a modal shell with three named `ng-content` slots:
      - `<ng-content select="[modal-header]">` — falls back to rendering `title` if no projected content.
      - `<ng-content select="[modal-body]">`
      - `<ng-content select="[modal-footer]">`
    - Add a close button (X icon using Lucide) in the header that emits `closed`.
    - Listen for `@HostListener('document:keydown.escape')` and emit `closed`.
    - Backdrop click: add a backdrop `div` that emits `closed` on click.
    - When `loading === true`, add `pointer-events-none opacity-50` to the footer slot wrapper.
    - Import `LucideAngularModule` for the X icon.
  - [ ] 6.2 Create the abstract `BaseFormFieldComponent`
    - In `base-form-field.component.ts`, create an abstract standalone `@Component` implementing `ControlValueAccessor`.
    - Use `inject(NgControl, { optional: true, self: true })` and set `ngControl.valueAccessor = this` in the constructor.
    - Inputs:
      - `@Input() label = ''`
      - `@Input() hint = ''`
      - `@Input() placeholder = ''`
      - `@Input() required = false`
      - `@Input() readonly = false`
      - `@Input() errorMessages: Record<string, string> = {}`
    - Declare a default error map:
      ```ts
      private defaultErrors: Record<string, string> = {
        required: 'This field is required.',
        email: 'Enter a valid email address.',
        minlength: 'Value is too short.',
        maxlength: 'Value is too long.',
        pattern: 'Invalid format.',
      };
      ```
    - Implement `getErrorMessage(): string | null`: merges `defaultErrors` with `errorMessages` input, returns the message for the first active error on `ngControl.control`, or `null` if valid.
    - Implement `ControlValueAccessor` methods: `writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`. Leave them as no-ops in the base; subclasses override as needed.
    - Template: wrap `<mat-form-field>` with `<mat-label>`, `<mat-hint>`, and `<mat-error>` auto-rendered. Use `ng-content` for the actual input element.
    - Import `MatFormFieldModule`, `ReactiveFormsModule`.
  - [ ] 6.3 Write unit tests for BaseModalComponent and BaseFormFieldComponent
    - `BaseModalComponent`: test ESC key emits `closed`; backdrop click emits `closed`; X button emits `closed`; `loading = true` disables footer interaction.
    - `BaseFormFieldComponent`: test `getErrorMessage()` returns correct message for `required`, `email`, `minlength` errors; test custom `errorMessages` override defaults; test `setDisabledState(true)` marks field as disabled.

- [ ] 7.0 Create stub implementations and write unit tests
  - [ ] 7.1 Create `StubUsersService`
    - In `_stubs/stub-users.service.ts`, define local types:
      ```ts
      interface User { id: number; name: string; email: string; }
      interface CreateUserDto { name: string; email: string; }
      interface UpdateUserDto { name?: string; email?: string; }
      interface UserQueryParams extends BaseQueryParams { search?: string; }
      ```
    - Create `@Injectable({ providedIn: 'root' }) class StubUsersService extends BaseApiService<User, CreateUserDto, UpdateUserDto, UserQueryParams>`.
    - Set `protected readonly endpoint = '/api/users'`.
    - Add a comment block at the top: `// STUB — for reference only. Not for production use.`
    - This class requires no method overrides — it inherits everything from `BaseApiService`.
  - [ ] 7.2 Create `StubUsersTableComponent`
    - In `_stubs/stub-users-table.component.ts`, create a standalone `@Component` extending `BaseTableComponent<User>`.
    - Add `@Component` decorator with a minimal template that projects column definitions into the base component's `[table-columns]` slot: `id`, `name`, `email` columns.
    - Add comment: `// STUB — for reference only. Not for production use.`
  - [ ] 7.3 Update barrel export
    - In `src/app/core/abstractions/index.ts`, export all public abstractions:
      - `BaseApiService`, `BaseCrudPage`, `BaseTableComponent`, `BaseModalComponent`, `BaseFormFieldComponent`, `ConfirmDialogService`.
      - Export types from `models/base.models.ts`.
      - Do NOT export stubs from the barrel.
  - [ ] 7.4 Run all tests, fix failures, stage and commit
    - Run `pnpm test` and ensure all unit tests pass.
    - Fix any type errors or test failures.
    - Stage all changes: `git add src/app/core/abstractions/`.
    - Commit: `feat: add base abstractions (api service, crud page, table, modal, form field, confirm dialog)`.
