import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  OnInit,
  Output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl, TouchedChangeEvent } from '@angular/forms';
import { filter, isObservable, Observable, of, Subscription } from 'rxjs';
import { Option } from '../types/form-option.type';
import { FormSize } from '../types/form-size.type';
import { getSizeClasses } from '../utils/form-size.utils';

@Component({
  selector: 'app-form-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="relative">
      <input
        type="text"
        [value]="displayValue()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onTouched()"
        [class]="inputClasses()" />

      @if (isOpen() && filteredOptions().length > 0) {
        <ul
          class="menu absolute z-50 w-full rounded-box bg-base-100 shadow border border-base-300 mt-1 max-h-60 overflow-auto"
          data-testid="autocomplete-panel">
          @for (option of filteredOptions(); track option.value) {
            <li>
              <a (mousedown)="selectOption(option)">{{ option.label }}</a>
            </li>
          }
        </ul>
      }
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
  protected readonly isOpen = signal(false);
  protected readonly filteredOptions = signal<Option[]>([]);

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

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

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.isOpen()) {
        this.isOpen.set(false);
        this.cdr.markForCheck();
      }
    }
  }

  protected inputClasses(): string {
    const size = getSizeClasses(this.size());
    const hasError = this.ngControl?.control?.invalid && this.ngControl?.control?.touched;
    const errorClass = hasError ? 'input-error' : '';
    return `input input-bordered w-full ${size} ${errorClass}`.trim();
  }

  protected onFocus(): void {
    this.isOpen.set(true);
  }

  protected onInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.displayValue.set(query);
    this.isOpen.set(true);
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

  protected selectOption(option: Option): void {
    this.displayValue.set(option.label);
    this.onChange(option.value);
    this.isOpen.set(false);
    this.cdr.markForCheck();
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
