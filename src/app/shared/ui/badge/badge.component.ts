import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted';
export type BadgeSize = 'sm' | 'md';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger:  'bg-danger/10 text-danger',
  info:    'bg-info/10 text-info',
  muted:   'bg-muted text-muted-foreground',
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
};

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dot) {
      <span
        class="inline-block rounded-full w-2 h-2"
        [class]="dotColorClass"
      ></span>
    } @else {
      <span
        class="inline-flex items-center rounded-full font-medium"
        [class]="variantClass + ' ' + sizeClass"
      >
        <ng-content />
      </span>
    }
  `,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'md';
  @Input() dot = false;

  get variantClass(): string {
    return VARIANT_CLASSES[this.variant];
  }

  get sizeClass(): string {
    return SIZE_CLASSES[this.size];
  }

  get dotColorClass(): string {
    // For dot mode, use the background half of each variant
    const dotMap: Record<BadgeVariant, string> = {
      primary: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      danger:  'bg-danger',
      info:    'bg-info',
      muted:   'bg-muted-foreground',
    };
    return dotMap[this.variant];
  }
}
