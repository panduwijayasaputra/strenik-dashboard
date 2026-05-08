import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { LucideAngularModule, User, type LucideIconData } from 'lucide-angular';
import { getAvatarColor, getInitials } from '../../utils/avatar.util';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_CLASSES: Record<AvatarSize, { wrapper: string; text: string; icon: number }> = {
  xs: { wrapper: 'w-6 h-6',   text: 'text-xs',  icon: 12 },
  sm: { wrapper: 'w-8 h-8',   text: 'text-sm',  icon: 14 },
  md: { wrapper: 'w-10 h-10', text: 'text-sm',  icon: 16 },
  lg: { wrapper: 'w-12 h-12', text: 'text-base', icon: 20 },
  xl: { wrapper: 'w-16 h-16', text: 'text-lg',  icon: 24 },
};

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="rounded-full overflow-hidden inline-flex items-center justify-center font-medium shrink-0"
      [class]="wrapperClass"
    >
      @if (src && !imgFailed()) {
        <img
          [src]="src"
          [alt]="name || 'Avatar'"
          class="w-full h-full object-cover"
          (error)="imgFailed.set(true)"
        />
      } @else if (initials) {
        <span class="select-none" [class]="initialsColorClass + ' w-full h-full inline-flex items-center justify-center ' + textClass">
          {{ initials }}
        </span>
      } @else if (icon) {
        <lucide-icon [img]="icon" [size]="iconSize" class="text-muted-foreground" />
      } @else {
        <lucide-icon [img]="defaultIcon" [size]="iconSize" class="text-muted-foreground" />
      }
    </span>
  `,
})
export class AvatarComponent {
  @Input() src: string | null = null;
  @Input() name = '';
  @Input() icon: LucideIconData | null = null;
  @Input() size: AvatarSize = 'md';

  protected readonly imgFailed = signal(false);
  protected readonly defaultIcon = User;

  get initials(): string {
    return getInitials(this.name);
  }

  get initialsColorClass(): string {
    return getAvatarColor(this.name);
  }

  get wrapperClass(): string {
    return SIZE_CLASSES[this.size].wrapper;
  }

  get textClass(): string {
    return SIZE_CLASSES[this.size].text;
  }

  get iconSize(): number {
    return SIZE_CLASSES[this.size].icon;
  }
}
