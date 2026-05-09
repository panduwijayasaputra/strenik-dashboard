import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
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
  selector: 'app-form-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <select
      [disabled]="isDisabled()"
      (change)="onValueChange($event)"
      (blur)="onTouchedFn()"
      [class]="selectClasses()">
      @if (placeholder()) {
        <option value="" disabled [selected]="value() === null || value() === ''">{{ placeholder() }}</option>
      }
      @for (option of resolvedOptions(); track option.value) {
        <option [value]="option.value" [selected]="option.value === value()">{{ option.label }}</option>
      }
    </select>
  `,
})
export class FormSelectComponent implements ControlValueAccessor, OnInit {
  options = input<Option[] | Observable<Option[]>>([]);
  placeholder = input('');
  size = input<FormSize>('md');

  protected readonly value = signal<unknown>(null);
  protected readonly isDisabled = signal(false);
  protected readonly resolvedOptions = signal<Option[]>([]);

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  private onChange: (value: unknown) => void = () => {};
  protected onTouchedFn: () => void = () => {};

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

  protected selectClasses(): string {
    const size = getSelectSizeClasses(this.size());
    const hasError = this.ngControl?.control?.invalid && this.ngControl?.control?.touched;
    const errorClass = hasError ? 'select-error' : '';
    return `select select-bordered w-full ${size} ${errorClass}`.trim();
  }

  protected onValueChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  writeValue(value: unknown): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
