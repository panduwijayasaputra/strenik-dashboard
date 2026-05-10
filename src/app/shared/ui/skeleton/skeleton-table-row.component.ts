import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-table-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (i of items; track i) {
      <div class="animate-pulse flex gap-4 items-center py-3 border-b border-border last:border-0">
        <div class="w-8 h-8 rounded-full bg-muted shrink-0"></div>
        <div class="h-3 bg-muted rounded w-1/4"></div>
        <div class="h-3 bg-muted rounded w-1/3"></div>
        <div class="h-3 bg-muted rounded w-1/5 ml-auto"></div>
      </div>
    }
  `,
})
export class SkeletonTableRowComponent {
  @Input() count = 1;

  get items(): number[] {
    return Array.from({ length: Math.max(1, this.count) }, (_, i) => i);
  }
}
