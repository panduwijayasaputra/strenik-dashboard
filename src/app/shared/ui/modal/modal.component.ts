import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule, X } from 'lucide-angular';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<ModalSize, string> = {
  sm: 'w-full max-w-[400px]',
  md: 'w-full max-w-[560px]',
  lg: 'w-full max-w-[720px]',
  xl: 'w-full max-w-[960px]',
};

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatDialogModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="dialog"
      [attr.aria-labelledby]="titleId"
      [class]="sizeClass"
      class="bg-card rounded-lg shadow-xl flex flex-col max-h-[90vh]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <h2 [id]="titleId" class="text-lg font-semibold text-foreground">{{ title }}</h2>
        <button
          type="button"
          (click)="close()"
          class="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <lucide-icon [img]="closeIcon" [size]="20" />
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 overflow-y-auto flex-1">
        <ng-content select="[modal-body]" />
      </div>

      <!-- Footer (always rendered; hidden if empty via CSS) -->
      <div class="px-6 py-4 border-t border-border shrink-0 flex justify-end gap-3 empty:hidden">
        <ng-content select="[modal-footer]" />
      </div>
    </div>
  `,
})
export class ModalComponent {
  @Input() title = '';
  @Input() size: ModalSize = 'md';
  @Output() closed = new EventEmitter<void>();

  protected readonly closeIcon = X;
  protected readonly titleId = `modal-title-${Math.random().toString(36).slice(2)}`;

  get sizeClass(): string {
    return SIZE_MAP[this.size];
  }

  close(): void {
    this.closed.emit();
    try {
      this._dialogRef?.close();
    } catch {
      // no-op when used outside MatDialog context
    }
  }

  // Optionally injected when opened via ModalService
  _dialogRef?: MatDialogRef<ModalComponent>;
}
