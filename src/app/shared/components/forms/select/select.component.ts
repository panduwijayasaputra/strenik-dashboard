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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { filter, isObservable, Observable, of, Subscription } from 'rxjs';
import { Option } from '../types/form-option.type';
import { FormSize } from '../types/form-size.type';

@Component({
  selector: 'app-form-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSelectModule, MatFormFieldModule],
  template: `
    <mat-select
      [value]="value()"
      [disabled]="isDisabled()"
      [placeholder]="placeholder()"
      (valueChange)="onValueChange($event)"
      (openedChange)="onOpenedChange($event)">
      @for (option of resolvedOptions(); track option.value) {
        <mat-option [value]="option.value">{{ option.label }}</mat-option>
      }
    </mat-select>
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

  protected onValueChange(value: unknown): void {
    this.value.set(value);
    this.onChange(value);
  }

  protected onOpenedChange(opened: boolean): void {
    if (!opened) {
      this.onTouchedFn();
    }
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
