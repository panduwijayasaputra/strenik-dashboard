import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (i of items; track i) {
      <div class="animate-pulse flex items-center gap-3 mb-3 last:mb-0">
        <div class="w-10 h-10 rounded-full bg-muted shrink-0"></div>
        <div class="flex-1">
          <div class="h-3 bg-muted rounded w-24 mb-1"></div>
          <div class="h-2 bg-muted rounded w-16"></div>
        </div>
      </div>
    }
  `,
})
export class SkeletonAvatarComponent {
  @Input() count = 1;

  get items(): number[] {
    return Array.from({ length: Math.max(1, this.count) }, (_, i) => i);
  }
}
