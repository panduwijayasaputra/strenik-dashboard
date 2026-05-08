import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (i of items; track i) {
      <div class="animate-pulse rounded-lg border border-border bg-card p-6 mb-4 last:mb-0">
        <div class="h-4 bg-muted rounded w-3/4 mb-3"></div>
        <div class="h-20 bg-muted rounded"></div>
      </div>
    }
  `,
})
export class SkeletonCardComponent {
  @Input() count = 1;

  get items(): number[] {
    return Array.from({ length: Math.max(1, this.count) }, (_, i) => i);
  }
}
