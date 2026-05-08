import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NAV_ITEMS } from '../../../core/navigation/nav-items.config';
import { LayoutService } from '../../../core/services/layout.service';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { NavItemComponent } from './nav-item/nav-item.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, NavGroupComponent, NavItemComponent],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  mobileMode = input<boolean>(false);

  readonly layoutService = inject(LayoutService);
  readonly navItems = NAV_ITEMS;

  private readonly hoverExpanded = signal(false);

  /** Collapsed only when: desktop + sidebar toggled off + not hover-peeking */
  readonly isMini = computed(
    () => !this.mobileMode() && !this.layoutService.sidebarExpanded() && !this.hoverExpanded()
  );

  onMouseEnter(): void {
    if (!this.mobileMode() && !this.layoutService.sidebarExpanded()) {
      this.hoverExpanded.set(true);
    }
  }

  onMouseLeave(): void {
    this.hoverExpanded.set(false);
  }
}
