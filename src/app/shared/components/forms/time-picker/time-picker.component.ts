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
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { filter } from 'rxjs';
import { FormSize } from '../types/form-size.type';
import { getSizeClasses } from '../utils/form-size.utils';

@Component({
  selector: 'app-form-time-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxMatTimepickerModule],
  template: `
    <div class="relative flex items-center">
      <input
        [ngxMatTimepicker]="picker"
        [value]="displayValue()"
        [format]="format()"
        [disabled]="isDisabled()"
        [placeholder]="placeholder()"
        (blur)="onTouched()"
        [class]="inputClasses()"
        readonly />

      <ngx-mat-timepicker
        #picker
        [format]="format()"
        (timeSet)="onTimeSet($event)" />
    </div>
  `,
})
export class FormTimePickerComponent implements ControlValueAccessor, OnInit {
  format = input<12 | 24>(24);
  placeholder = input('');
  size = input<FormSize>('md');

  protected readonly displayValue = signal('');
  protected readonly isDisabled = signal(false);

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
    const border = hasError ? 'border-danger' : 'border-input';
    return `w-full rounded border ${border} bg-background ${size} placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer`;
  }

  protected onTimeSet(timeString: string): void {
    const formatted = this.toHHmm(timeString);
    this.displayValue.set(formatted);
    this.onChange(formatted);
  }

  private toHHmm(timeString: string): string {
    // Handle AM/PM format (e.g. "09:05 AM" or "12:30 PM")
    const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return timeString;
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3]?.toUpperCase();
    if (period === 'AM' && hours === 12) hours = 0;
    if (period === 'PM' && hours !== 12) hours += 12;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  writeValue(value: string | null): void {
    this.displayValue.set(value ?? '');
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
