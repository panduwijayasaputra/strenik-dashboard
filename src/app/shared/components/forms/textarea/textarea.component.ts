import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl, TouchedChangeEvent } from '@angular/forms';
import { filter } from 'rxjs';
import { FormSize } from '../types/form-size.type';
import { getTextareaSizeClasses } from '../utils/form-size.utils';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <textarea
      #ta
      [rows]="rows()"
      [placeholder]="placeholder()"
      [disabled]="isDisabled()"
      [value]="value()"
      (input)="onInput($event)"
      (blur)="onTouched()"
      [class]="textareaClasses()"></textarea>
  `,
})
export class FormTextareaComponent implements ControlValueAccessor, OnInit {
  rows = input(3);
  size = input<FormSize>('md');
  placeholder = input('');
  autoResize = input(false);

  @ViewChild('ta') private taRef!: ElementRef<HTMLTextAreaElement>;

  protected readonly value = signal('');
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

  protected textareaClasses(): string {
    const size = getTextareaSizeClasses(this.size());
    const hasError = this.ngControl?.control?.invalid && this.ngControl?.control?.touched;
    const errorClass = hasError ? 'textarea-error' : '';
    return `textarea textarea-bordered w-full resize-y ${size} ${errorClass}`.trim();
  }

  protected onInput(event: Event): void {
    const ta = event.target as HTMLTextAreaElement;
    this.value.set(ta.value);
    this.onChange(ta.value);
    if (this.autoResize()) {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    }
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
