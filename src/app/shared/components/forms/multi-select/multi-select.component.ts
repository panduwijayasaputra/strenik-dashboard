import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl, TouchedChangeEvent } from '@angular/forms';
import { filter, isObservable, Observable, of, Subscription } from 'rxjs';
import { Option } from '../types/form-option.type';
import { FormSize } from '../types/form-size.type';
import { getSelectSizeClasses } from '../utils/form-size.utils';

@Component({
  selector: 'app-form-multi-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="relative">
      <div
        data-testid="multi-select-trigger"
        [class]="triggerClasses()"
        (click)="toggleDropdown()">
        @if (value().length === 0) {
          <span class="opacity-50">{{ placeholder() }}</span>
        } @else {
          <div class="flex flex-wrap gap-1">
            @for (val of value(); track val) {
              <span class="badge badge-primary gap-1" data-testid="selected-chip">
                {{ labelFor(val) }}
                @if (!isDisabled()) {
                  <button
                    type="button"
                    aria-label="Remove"
                    (click)="removeChip(val); $event.stopPropagation()">×</button>
                }
              </span>
            }
          </div>
        }
        <span class="ml-auto pl-2 shrink-0">▾</span>
      </div>

      @if (isOpen()) {
        <ul
          class="menu absolute z-50 w-full rounded-box bg-base-100 shadow border border-base-300 mt-1 max-h-60 overflow-auto"
          data-testid="dropdown-panel">
          @for (option of resolvedOptions(); track option.value) {
            <li>
              <a
                [class.active]="isSelected(option.value)"
                [class.disabled]="isOptionDisabled(option.value)"
                (click)="toggleOption(option.value)">
                {{ option.label }}
              </a>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class FormMultiSelectComponent implements ControlValueAccessor, OnInit {
  options = input<Option[] | Observable<Option[]>>([]);
  placeholder = input('');
  maxSelections = input<number | null>(null);
  size = input<FormSize>('md');

  protected readonly value = signal<unknown[]>([]);
  protected readonly isDisabled = signal(false);
  protected readonly isOpen = signal(false);
  protected readonly resolvedOptions = signal<Option[]>([]);

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  private onChange: (value: unknown[]) => void = () => {};
  private onTouchedFn: () => void = () => {};
  private optionsSub?: Subscription;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    effect(() => {
      const opts = this.options();
      this.optionsSub?.unsubscribe();
      const opts$ = isObservable(opts) ? opts : of(opts);
      untracked(() => {
        this.optionsSub = opts$
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((list) => {
            this.resolvedOptions.set(list);
            this.cdr.markForCheck();
          });
      });
    });
  }

  ngOnInit(): void {
    const control = this.ngControl?.control;
    if (!control) return;
    control.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
    control.events
      .pipe(
        filter((e) => e instanceof TouchedChangeEvent),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.cdr.markForCheck());
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.isOpen()) {
        this.isOpen.set(false);
        this.onTouchedFn();
        this.cdr.markForCheck();
      }
    }
  }

  protected triggerClasses(): string {
    const size = getSelectSizeClasses(this.size());
    const hasError = this.ngControl?.control?.invalid && this.ngControl?.control?.touched;
    const errorClass = hasError ? 'select-error' : '';
    const disabledClass = this.isDisabled() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer';
    return `select select-bordered w-full h-auto min-h-[2.5rem] ${size} ${errorClass} ${disabledClass} flex items-center flex-wrap`.trim();
  }

  protected toggleDropdown(): void {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
  }

  protected isSelected(optionValue: unknown): boolean {
    return this.value().includes(optionValue);
  }

  protected isOptionDisabled(optionValue: unknown): boolean {
    const max = this.maxSelections();
    if (max === null) return false;
    const selected = this.value();
    if (selected.length < max) return false;
    return !selected.includes(optionValue);
  }

  protected labelFor(val: unknown): string {
    return this.resolvedOptions().find((o) => o.value === val)?.label ?? String(val);
  }

  protected toggleOption(optionValue: unknown): void {
    if (this.isOptionDisabled(optionValue)) return;
    const current = this.value();
    const updated = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];
    this.value.set(updated);
    this.onChange(updated);
  }

  protected removeChip(val: unknown): void {
    const updated = this.value().filter((v) => v !== val);
    this.value.set(updated);
    this.onChange(updated);
  }

  writeValue(value: unknown[]): void {
    this.value.set(Array.isArray(value) ? value : []);
  }

  registerOnChange(fn: (value: unknown[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
