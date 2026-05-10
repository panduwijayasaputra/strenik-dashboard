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
import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular';
import { FormSize } from '../types/form-size.type';
import { getSizeClasses } from '../utils/form-size.utils';

@Component({
  selector: 'app-form-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <div class="relative flex items-center">
      <div class="absolute left-0 flex items-center pl-3 pointer-events-none">
        <ng-content select="[prefix]" />
      </div>

      <input
        [type]="effectiveType()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [class]="inputClasses()" />

      @if (type() === 'password') {
        <button
          type="button"
          aria-label="Toggle password visibility"
          class="absolute right-2 flex items-center text-muted-foreground"
          (click)="togglePasswordVisibility()">
          @if (showPassword()) {
            <lucide-icon [img]="EyeOff" size="16" />
          } @else {
            <lucide-icon [img]="Eye" size="16" />
          }
        </button>
      }

      <div class="absolute right-0 flex items-center pr-3 pointer-events-none">
        <ng-content select="[suffix]" />
      </div>
    </div>
  `,
})
export class FormInputComponent implements ControlValueAccessor, OnInit {
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  type = input<'text' | 'email' | 'password' | 'number'>('text');
  size = input<FormSize>('md');
  placeholder = input('');

  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);
  protected readonly showPassword = signal(false);

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

  protected readonly effectiveType = () =>
    this.type() === 'password' && this.showPassword() ? 'text' : this.type();

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

  protected togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  writeValue(value: string): void {
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
