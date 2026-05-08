import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="alertClass()"><ng-content /></div>`,
})
export class AlertComponent {
  type = input<'info' | 'success' | 'warning' | 'danger'>('info');

  alertClass() {
    const v: Record<string, string> = {
      info: 'bg-blue-50 text-blue-800 border-blue-200',
      success: 'bg-green-50 text-green-800 border-green-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      danger: 'bg-red-50 text-red-800 border-red-200',
    };
    return `rounded border p-4 text-sm ${v[this.type()]}`;
  }
}
