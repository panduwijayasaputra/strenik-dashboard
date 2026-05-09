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
import { UploadCloud, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dropzone',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <div
      data-testid="dropzone"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
      [class]="zoneClasses()">
      <input
        #fileInput
        type="file"
        class="hidden"
        [accept]="accept()"
        [multiple]="multiple()"
        (change)="onFileChange($event)" />

      <lucide-icon [img]="UploadCloud" size="32" class="text-muted-foreground" />
      <p class="text-sm text-muted-foreground">
        Drag & drop files here, or <span class="text-primary underline cursor-pointer">browse</span>
      </p>
    </div>
  `,
})
export class DropzoneComponent {
  readonly UploadCloud = UploadCloud;

  accept = input('');
  multiple = input(false);
  disabled = input(false);

  @Output() filesDropped = new EventEmitter<File[]>();

  @ViewChild('fileInput') private fileInputRef!: ElementRef<HTMLInputElement>;

  protected readonly isDragOver = signal(false);

  protected zoneClasses(): string {
    const base =
      'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors';
    const drag = this.isDragOver() ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50';
    const dis = this.disabled() ? 'opacity-50 pointer-events-none' : '';
    return `${base} ${drag} ${dis}`.trim();
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  protected onDragLeave(): void {
    this.isDragOver.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.filesDropped.emit(Array.from(files));
    }
  }

  protected onFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.filesDropped.emit(Array.from(files));
    }
  }
}
