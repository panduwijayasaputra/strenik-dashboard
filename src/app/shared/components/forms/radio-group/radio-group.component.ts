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
import { Option } from '../types/form-option.type';
import { FormSize } from '../types/form-size.type';

let nextId = 0;

@Component({
  selector: 'app-form-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="radiogroup"
      class="flex gap-3"
      [class]="containerClasses()">
      @for (option of options(); track option.value) {
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            [name]="groupName"
            [value]="option.value"
            [checked]="value() === option.value"
            [disabled]="isDisabled()"
            (change)="onSelect(option.value)"
            (blur)="onTouched()"
            class="radio radio-primary" />
          <span class="text-sm text-foreground">{{ option.label }}</span>
        </label>
      }
    </div>
  `,
})
export class FormRadioGroupComponent implements ControlValueAccessor, OnInit {
  options = input<Option[]>([]);
  orientation = input<'horizontal' | 'vertical'>('vertical');
  size = input<FormSize>('md');

  protected readonly value = signal<unknown>(null);
  protected readonly isDisabled = signal(false);
  protected readonly groupName = `radio-group-${nextId++}`;

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  private onChange: (value: unknown) => void = () => {};
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

  protected containerClasses(): string {
    const dir = this.orientation() === 'horizontal' ? 'flex-row' : 'flex-col';
    const hasError = this.ngControl?.control?.invalid && this.ngControl?.control?.touched;
    const border = hasError ? 'border-2 border-error rounded p-2' : '';
    return `${dir} ${border}`.trim();
  }

  protected onSelect(value: unknown): void {
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
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
