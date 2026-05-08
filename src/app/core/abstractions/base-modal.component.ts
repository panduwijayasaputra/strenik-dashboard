import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-base-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    @if (isOpen) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-40 bg-black/50"
        (click)="close()"
        aria-hidden="true"
      ></div>

      <!-- Modal panel -->
      <div
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-surface shadow-xl">

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-border px-6 py-4">
            <ng-content select="[modal-header]">
              <h2 class="text-lg font-semibold text-foreground">{{ title }}</h2>
            </ng-content>
            <button
              type="button"
              class="ml-4 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
              (click)="close()"
            >
              <lucide-icon name="x" [size]="20" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-4">
            <ng-content select="[modal-body]" />
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-end gap-2 border-t border-border px-6 py-4"
            [class.pointer-events-none]="loading"
            [class.opacity-50]="loading"
          >
            <ng-content select="[modal-footer]" />
          </div>
        </div>
      </div>
    }
  `,
})
export class BaseModalComponent {
  @Input() title = '';
  @Input() isOpen = false;
  @Input() loading = false;

  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
