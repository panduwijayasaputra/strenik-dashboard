import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
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

  /** In mobile mode always show expanded; on desktop follow the signal. */
  readonly isMini = computed(() => !this.mobileMode() && !this.layoutService.sidebarExpanded());
}
