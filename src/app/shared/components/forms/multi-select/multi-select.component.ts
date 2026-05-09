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
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { filter, isObservable, Observable, of, Subscription } from 'rxjs';
import { Option } from '../types/form-option.type';
import { FormSize } from '../types/form-size.type';

@Component({
  selector: 'app-form-multi-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSelectModule, MatFormFieldModule, MatChipsModule, MatIconModule],
  template: `
    <mat-select
      multiple
      [value]="value()"
      [disabled]="isDisabled()"
      [placeholder]="placeholder()"
      (valueChange)="onValueChange($event)"
      (openedChange)="onOpenedChange($event)">
      @for (option of resolvedOptions(); track option.value) {
        <mat-option [value]="option.value" [disabled]="isOptionDisabled(option.value)">
          {{ option.label }}
        </mat-option>
      }
    </mat-select>

    @if (value().length > 0) {
      <div class="flex flex-wrap gap-1 mt-1">
        @for (val of value(); track val) {
          <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs">
            {{ labelFor(val) }}
            @if (!isDisabled()) {
              <button
                type="button"
                aria-label="Remove"
                class="ml-1 text-primary hover:text-danger"
                (click)="removeChip(val)">
                ×
              </button>
            }
          </span>
        }
      </div>
    }
  `,
})
export class FormMultiSelectComponent implements ControlValueAccessor, OnInit {
  options = input<Option[] | Observable<Option[]>>([]);
  placeholder = input('');
  maxSelections = input<number | null>(null);
  size = input<FormSize>('md');

  protected readonly value = signal<unknown[]>([]);
  protected readonly isDisabled = signal(false);
  protected readonly resolvedOptions = signal<Option[]>([]);

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

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

  protected onValueChange(value: unknown[]): void {
    this.value.set(value ?? []);
    this.onChange(value ?? []);
  }

  protected onOpenedChange(opened: boolean): void {
    if (!opened) this.onTouchedFn();
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
