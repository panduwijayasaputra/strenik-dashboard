import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="badgeClass()"><ng-content /></span>`,
})
export class BadgeComponent {
  variant = input<'default' | 'success' | 'warning' | 'danger'>('default');

  badgeClass() {
    const v: Record<string, string> = {
      default: 'bg-secondary text-secondary-foreground',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
    };
    return `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${v[this.variant()]}`;
  }
}
