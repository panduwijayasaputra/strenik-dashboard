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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { filter } from 'rxjs';
import { Calendar, LucideAngularModule } from 'lucide-angular';
import { FormSize } from '../types/form-size.type';
import { getSizeClasses } from '../utils/form-size.utils';

@Component({
  selector: 'app-form-date-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDatepickerModule, MatNativeDateModule, LucideAngularModule],
  template: `
    <div class="relative flex items-center">
      <input
        matDatepickerInput
        [matDatepicker]="picker"
        [min]="min()"
        [max]="max()"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        (dateChange)="onDateChange($event)"
        (blur)="onTouched()"
        [class]="inputClasses()" />

      <mat-datepicker-toggle [for]="picker" class="absolute right-1">
        <lucide-icon matDatepickerToggleIcon [img]="Calendar" size="16" />
      </mat-datepicker-toggle>

      <mat-datepicker #picker />
    </div>
  `,
})
export class FormDatePickerComponent implements ControlValueAccessor, OnInit {
  readonly Calendar = Calendar;

  min = input<Date | null>(null);
  max = input<Date | null>(null);
  placeholder = input('');
  size = input<FormSize>('md');

  protected readonly value = signal<Date | null>(null);
  protected readonly isDisabled = signal(false);

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  private onChange: (value: Date | null) => void = () => {};
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
    const border = hasError ? 'border-danger' : 'border-input';
    return `w-full rounded border ${border} bg-background ${size} placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-8`;
  }

  protected onDateChange(event: { value: Date | null }): void {
    this.value.set(event.value);
    this.onChange(event.value);
  }

  writeValue(value: Date | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
