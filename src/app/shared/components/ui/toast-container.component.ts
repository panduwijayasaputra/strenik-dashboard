import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div [class]="toastClass(toast.type)" class="flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium min-w-64">
          {{ toast.message }}
          <button class="ml-auto opacity-70 hover:opacity-100" (click)="toastService.dismiss(toast.id)">&#x2715;</button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  toastClass(type: string) {
    const v: Record<string, string> = {
      success: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      warning: 'bg-yellow-500 text-white',
      info: 'bg-primary text-primary-foreground',
    };
    return v[type] ?? v['info'];
  }
}
