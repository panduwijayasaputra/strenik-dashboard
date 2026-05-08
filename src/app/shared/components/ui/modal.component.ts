import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" (click)="closed.emit()">
        <div class="w-full max-w-lg rounded-lg bg-card p-6 shadow-xl" (click)="$event.stopPropagation()">
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  open = input(false);
  closed = output<void>();
}
