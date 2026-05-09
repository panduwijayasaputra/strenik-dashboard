import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl, TouchedChangeEvent } from '@angular/forms';
import { Editor } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { filter } from 'rxjs';
import { FormSize } from '../types/form-size.type';

@Component({
  selector: 'app-wysiwyg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div data-testid="wysiwyg-container" [class]="containerClasses()">
      <div class="flex flex-wrap gap-1 p-1 border-b border-base-300">
        <div class="join">
          <button type="button" class="btn btn-sm join-item font-bold" title="Bold"
            (click)="execCommand('bold')" [class.btn-active]="isActive('bold')" [disabled]="isDisabled()">B</button>
          <button type="button" class="btn btn-sm join-item italic" title="Italic"
            (click)="execCommand('italic')" [class.btn-active]="isActive('italic')" [disabled]="isDisabled()">I</button>
        </div>
        <div class="join">
          <button type="button" class="btn btn-sm join-item" title="Bullet list"
            (click)="execCommand('bulletList')" [class.btn-active]="isActive('bulletList')" [disabled]="isDisabled()">•</button>
          <button type="button" class="btn btn-sm join-item" title="Ordered list"
            (click)="execCommand('orderedList')" [class.btn-active]="isActive('orderedList')" [disabled]="isDisabled()">1.</button>
          <button type="button" class="btn btn-sm join-item" title="Blockquote"
            (click)="execCommand('blockquote')" [class.btn-active]="isActive('blockquote')" [disabled]="isDisabled()">❝</button>
        </div>
      </div>
      <div #editorContainer class="prose max-w-none p-3 min-h-[120px] focus-within:outline-none"></div>
    </div>
  `,
})
export class WysiwygComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorContainer') editorContainer!: ElementRef<HTMLDivElement>;

  placeholder = input('');
  size = input<FormSize>('md');

  protected readonly isDisabled = signal(false);
  protected editor: Editor | null = null;

  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  private pendingValue = '';

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

  ngAfterViewInit(): void {
    this.editor = new Editor({
      element: this.editorContainer.nativeElement,
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder: this.placeholder() }),
      ],
      content: this.pendingValue,
      editable: !this.isDisabled(),
      onUpdate: ({ editor }) => {
        this.onEditorUpdate(editor.getHTML());
      },
      onBlur: () => {
        this.onTouched();
        this.cdr.markForCheck();
      },
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  protected containerClasses(): string {
    const hasError = this.ngControl?.control?.invalid && this.ngControl?.control?.touched;
    const borderClass = hasError ? 'border-error' : 'border-base-300';
    return `rounded border ${borderClass} bg-base-100 overflow-hidden`;
  }

  protected onEditorUpdate(html: string): void {
    this.onChange(html);
    this.cdr.markForCheck();
  }

  protected execCommand(command: string): void {
    if (!this.editor) return;
    const chain = this.editor.chain().focus();
    switch (command) {
      case 'bold':
        chain.toggleBold().run();
        break;
      case 'italic':
        chain.toggleItalic().run();
        break;
      case 'bulletList':
        chain.toggleBulletList().run();
        break;
      case 'orderedList':
        chain.toggleOrderedList().run();
        break;
      case 'blockquote':
        chain.toggleBlockquote().run();
        break;
    }
    this.cdr.markForCheck();
  }

  protected isActive(mark: string): boolean {
    return this.editor?.isActive(mark) ?? false;
  }

  writeValue(html: string | null): void {
    this.pendingValue = html ?? '';
    if (this.editor) {
      this.editor.commands.setContent(this.pendingValue, { emitUpdate: false });
    }
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
    this.editor?.setEditable(!isDisabled);
    this.cdr.markForCheck();
  }
}
