import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl, TouchedChangeEvent } from '@angular/forms';
import { filter } from 'rxjs';
import { FormSize } from '../types/form-size.type';
import { getSizeClasses } from '../utils/form-size.utils';

@Component({
  selector: 'app-form-date-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      type="date"
      [min]="minStr()"
      [max]="maxStr()"
      [value]="value()"
      [placeholder]="placeholder()"
      [disabled]="isDisabled()"
      (input)="onInput($event)"
      (blur)="onTouched()"
      [class]="inputClasses()" />
  `,
})
export class FormDatePickerComponent implements ControlValueAccessor, OnInit {
  min = input<Date | string | null>(null);
  max = input<Date | string | null>(null);
  placeholder = input('');
  size = input<FormSize>('md');

  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);

  protected minStr(): string {
    const v = this.min();
    if (!v) return '';
    return v instanceof Date ? v.toISOString().substring(0, 10) : v;
  }

  protected maxStr(): string {
    const v = this.max();
    if (!v) return '';
    return v instanceof Date ? v.toISOString().substring(0, 10) : v;
  }

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
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

  protected inputClasses(): string {
    const size = getSizeClasses(this.size());
    const hasError = this.ngControl?.control?.invalid && this.ngControl?.control?.touched;
    const errorClass = hasError ? 'input-error' : '';
    return `input input-bordered w-full ${size} ${errorClass}`.trim();
  }

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
