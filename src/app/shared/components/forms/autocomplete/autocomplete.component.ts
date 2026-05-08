import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl, TouchedChangeEvent } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { filter, isObservable, Observable, of, Subscription } from 'rxjs';
import { Option } from '../types/form-option.type';
import { FormSize } from '../types/form-size.type';
import { getSizeClasses } from '../utils/form-size.utils';

@Component({
  selector: 'app-form-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatAutocompleteModule],
  template: `
    <div class="relative">
      <input
        #trigger="matAutocompleteTrigger"
        [matAutocomplete]="auto"
        [value]="displayValue()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [class]="inputClasses()" />

      <mat-autocomplete
        #auto="matAutocomplete"
        (optionSelected)="onOptionSelected($event)">
        @for (option of filteredOptions(); track option.value) {
          <mat-option [value]="option">{{ option.label }}</mat-option>
        }
      </mat-autocomplete>
    </div>
  `,
})
export class FormAutocompleteComponent implements ControlValueAccessor, OnInit {
  options = input<Option[] | Observable<Option[]>>([]);
  placeholder = input('');
  size = input<FormSize>('md');

  @Output() search = new EventEmitter<string>();

  protected readonly displayValue = signal('');
  protected readonly isDisabled = signal(false);
  protected readonly filteredOptions = signal<Option[]>([]);

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  private onChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  private allOptions: Option[] = [];
  private isObservableSource = false;
  private optionsSub?: Subscription;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    effect(() => {
      const opts = this.options();
      this.optionsSub?.unsubscribe();
      this.isObservableSource = isObservable(opts);
      const opts$ = this.isObservableSource ? (opts as Observable<Option[]>) : of(opts as Option[]);
      untracked(() => {
        this.optionsSub = opts$
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((list) => {
            this.allOptions = list;
            this.filteredOptions.set(list);
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

  protected inputClasses(): string {
    const size = getSizeClasses(this.size());
    const hasError = this.ngControl?.control?.invalid && this.ngControl?.control?.touched;
    const border = hasError ? 'border-danger' : 'border-input';
    return `w-full rounded border ${border} bg-background ${size} placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`;
  }

  protected onInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    if (this.isObservableSource) {
      this.search.emit(query);
    } else {
      const lower = query.toLowerCase();
      this.filteredOptions.set(
        lower
          ? this.allOptions.filter((o) => o.label.toLowerCase().includes(lower))
          : this.allOptions,
      );
    }
  }

  protected onOptionSelected(event: { option: { value: Option } }): void {
    const selected = event.option.value;
    this.selectOption(selected);
  }

  protected selectOption(option: Option): void {
    this.displayValue.set(option.label);
    this.onChange(option.value);
  }

  writeValue(value: unknown): void {
    if (value == null) {
      this.displayValue.set('');
      return;
    }
    const match = this.allOptions.find((o) => o.value === value);
    this.displayValue.set(match?.label ?? String(value));
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
