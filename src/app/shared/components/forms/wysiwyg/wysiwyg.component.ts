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
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { ContentChange, QuillModule } from 'ngx-quill';
import { FormSize } from '../types/form-size.type';

const DEFAULT_TOOLBAR = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['link'],
  ['clean'],
];

@Component({
  selector: 'app-wysiwyg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuillModule, FormsModule],
  template: `
    <div
      data-testid="wysiwyg-container"
      [class]="containerClasses()">
      <quill-editor
        [ngModel]="htmlValue()"
        (onContentChanged)="onContentChanged($event)"
        (onBlur)="onTouched()"
        [readOnly]="isDisabled()"
        [placeholder]="placeholder()"
        [modules]="{ toolbar: toolbar() }"
        class="block w-full" />
    </div>
  `,
})
export class WysiwygComponent implements ControlValueAccessor, OnInit {
  toolbar = input<unknown[][]>(DEFAULT_TOOLBAR);
  placeholder = input('');
  size = input<FormSize>('md');

  protected readonly htmlValue = signal('');
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

  protected containerClasses(): string {
    const hasError = this.ngControl?.control?.invalid && this.ngControl?.control?.touched;
    const border = hasError ? 'border-danger' : 'border-input';
    return `rounded border ${border} bg-background overflow-hidden`;
  }

  protected onContentChanged(event: ContentChange): void {
    if (event.source === 'api') return;
    this.onChange(event.html ?? '');
  }

  writeValue(html: string | null): void {
    this.htmlValue.set(html ?? '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }
}
