import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, AlertTriangle, XCircle, Info, X, type LucideIconData } from 'lucide-angular';

export type AlertType = 'success' | 'warning' | 'error' | 'info';

interface AlertStyle {
  container: string;
  icon: string;
  lucideIcon: LucideIconData;
}

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div
        role="alert"
        [class]="containerClass"
        class="flex items-start gap-3 rounded-lg border p-4"
      >
        <lucide-icon [img]="iconData" [size]="18" class="mt-0.5 shrink-0" [class]="iconClass" />
        <div class="flex-1 min-w-0">
          @if (title) {
            <p class="font-semibold text-sm mb-0.5">{{ title }}</p>
          }
          <p class="text-sm">{{ message }}</p>
        </div>
        @if (dismissible) {
          <button
            type="button"
            (click)="dismiss()"
            class="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss alert"
          >
            <lucide-icon [img]="closeIcon" [size]="16" />
          </button>
        }
      </div>
    }
  `,
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() dismissible = false;
  @Output() dismissed = new EventEmitter<void>();

  protected readonly closeIcon = X;
  protected readonly visible = signal(true);

  private readonly styleMap: Record<AlertType, AlertStyle> = {
    success: {
      container: 'bg-success/10 border-success/30 text-success',
      icon: 'text-success',
      lucideIcon: CheckCircle,
    },
    warning: {
      container: 'bg-warning/10 border-warning/30 text-warning',
      icon: 'text-warning',
      lucideIcon: AlertTriangle,
    },
    error: {
      container: 'bg-danger/10 border-danger/30 text-danger',
      icon: 'text-danger',
      lucideIcon: XCircle,
    },
    info: {
      container: 'bg-info/10 border-info/30 text-info',
      icon: 'text-info',
      lucideIcon: Info,
    },
  };

  get containerClass(): string {
    return this.styleMap[this.type].container;
  }

  get iconClass(): string {
    return this.styleMap[this.type].icon;
  }

  get iconData(): LucideIconData {
    return this.styleMap[this.type].lucideIcon;
  }

  dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
