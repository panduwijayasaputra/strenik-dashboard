import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { Upload, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <div class="flex flex-col gap-1">
      <input
        #fileInput
        type="file"
        class="hidden"
        [accept]="accept()"
        [multiple]="multiple()"
        (change)="onFileChange($event)" />

      <button
        type="button"
        [disabled]="disabled()"
        (click)="fileInput.click()"
        class="inline-flex items-center gap-2 rounded border border-input bg-background px-3 py-2 text-sm text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">
        <lucide-icon [img]="Upload" size="16" />
        <span>{{ buttonLabel() }}</span>
      </button>

      @if (selectedNames().length > 0) {
        <ul class="mt-1 space-y-0.5">
          @for (name of selectedNames(); track name) {
            <li class="text-xs text-muted-foreground truncate">{{ name }}</li>
          }
        </ul>
      }
    </div>
  `,
})
export class FileUploadComponent {
  readonly Upload = Upload;

  accept = input('');
  multiple = input(false);
  disabled = input(false);
  buttonLabel = input('Choose file');

  @Output() filesSelected = new EventEmitter<File[]>();

  @ViewChild('fileInput') private fileInputRef!: ElementRef<HTMLInputElement>;

  protected readonly selectedNames = signal<string[]>([]);

  protected onFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    this.selectedNames.set(fileArray.map((f) => f.name));
    this.filesSelected.emit(fileArray);
  }
}
