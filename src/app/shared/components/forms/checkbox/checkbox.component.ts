import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
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

@Component({
  selector: 'app-form-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="inline-flex items-center gap-2 cursor-pointer">
      <input
        #cb
        type="checkbox"
        [checked]="value()"
        [disabled]="isDisabled()"
        (change)="onChange($event)"
        (blur)="onTouched()"
        [class]="checkboxClasses()" />
      @if (label()) {
        <span class="text-sm text-foreground select-none">{{ label() }}</span>
      }
    </label>
  `,
})
export class FormCheckboxComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  label = input('');
  indeterminate = input(false);
  size = input<FormSize>('md');

  @ViewChild('cb') private cbRef!: ElementRef<HTMLInputElement>;

  protected readonly value = signal(false);
  protected readonly isDisabled = signal(false);

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  private onChangeFn: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    effect(() => {
      const val = this.indeterminate();
      if (this.cbRef) {
        this.cbRef.nativeElement.indeterminate = val;
      }
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

  ngAfterViewInit(): void {
    this.syncIndeterminate();
  }

  protected checkboxClasses(): string {
    const hasError = this.ngControl?.control?.invalid && this.ngControl?.control?.touched;
    const errorClass = hasError ? 'checkbox-error' : '';
    return `checkbox ${errorClass}`.trim();
  }

  protected onChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.value.set(checked);
    this.onChangeFn(checked);
  }

  private syncIndeterminate(): void {
    if (this.cbRef) {
      this.cbRef.nativeElement.indeterminate = this.indeterminate();
    }
  }

  writeValue(value: boolean): void {
    this.value.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
