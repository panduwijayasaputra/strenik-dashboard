import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl, TouchedChangeEvent } from '@angular/forms';
import { filter, isObservable, Observable, of, Subscription } from 'rxjs';
import { FormSize } from '../types/form-size.type';
import { getSizeClasses } from '../utils/form-size.utils';

@Component({
  selector: 'app-form-tags-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-1">
      <!-- chips row -->
      @if (tags().length > 0) {
        <div class="flex flex-wrap gap-1">
          @for (tag of tags(); track tag + $index) {
            <span
              data-testid="tag-chip"
              class="badge badge-primary gap-1">
              {{ tag }}
              @if (!isDisabled()) {
                <button
                  type="button"
                  aria-label="Remove tag"
                  class="leading-none"
                  (click)="removeTag(tag)">×</button>
              }
            </span>
          }
        </div>
      }

      <!-- input + suggestion dropdown -->
      <div class="relative">
        <input
          #textInput
          type="text"
          [value]="inputValue()"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
          (input)="onInput($event)"
          (keydown)="onKeydown($event)"
          (blur)="onTouched()"
          [class]="inputClasses()" />

        @if (filteredSuggestions().length > 0 && inputValue().length > 0) {
          <ul class="menu absolute z-10 w-full mt-1 rounded-box border border-base-300 bg-base-100 shadow text-sm max-h-48 overflow-y-auto p-1">
            @for (s of filteredSuggestions(); track s) {
              <li><a (mousedown)="addTag(s)">{{ s }}</a></li>
            }
          </ul>
        }
      </div>
    </div>
  `,
})
export class FormTagsInputComponent implements ControlValueAccessor, OnInit {
  suggestions = input<string[] | Observable<string[]> | null>(null);
  allowDuplicates = input(false);
  placeholder = input('');
  size = input<FormSize>('md');

  @Output() search = new EventEmitter<string>();

  @ViewChild('textInput') private textInputRef?: ElementRef<HTMLInputElement>;

  protected readonly tags = signal<string[]>([]);
  protected readonly inputValue = signal('');
  protected readonly isDisabled = signal(false);
  protected readonly filteredSuggestions = signal<string[]>([]);

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  private onChange: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  private allSuggestions: string[] = [];
  private isObservableSource = false;
  private suggestionSub?: Subscription;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    effect(() => {
      const src = this.suggestions();
      this.suggestionSub?.unsubscribe();
      this.isObservableSource = isObservable(src);
      const src$ = this.isObservableSource
        ? (src as Observable<string[]>)
        : of((src as string[] | null) ?? []);
      untracked(() => {
        this.suggestionSub = src$
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((list) => {
            this.allSuggestions = list;
            this.updateFiltered(this.inputValue());
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
    const errorClass = hasError ? 'input-error' : '';
    return `input input-bordered w-full ${size} ${errorClass}`.trim();
  }

  protected onInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.inputValue.set(query);
    if (this.isObservableSource) {
      this.search.emit(query);
    } else {
      this.updateFiltered(query);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const val = this.inputValue().trim();
      if (val) this.addTag(val);
    }
  }

  protected addTag(tag: string): void {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (!this.allowDuplicates() && this.tags().includes(trimmed)) return;
    const updated = [...this.tags(), trimmed];
    this.tags.set(updated);
    this.inputValue.set('');
    if (this.textInputRef) {
      this.textInputRef.nativeElement.value = '';
    }
    this.filteredSuggestions.set([]);
    this.onChange(updated);
    this.cdr.markForCheck();
  }

  protected removeTag(tag: string): void {
    const updated = this.tags().filter((t) => t !== tag);
    this.tags.set(updated);
    this.onChange(updated);
    this.cdr.markForCheck();
  }

  private updateFiltered(query: string): void {
    if (!query) {
      this.filteredSuggestions.set([]);
      return;
    }
    const lower = query.toLowerCase();
    this.filteredSuggestions.set(
      this.allSuggestions.filter((s) => s.toLowerCase().includes(lower)),
    );
  }

  writeValue(value: string[] | null): void {
    this.tags.set(Array.isArray(value) ? value : []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
