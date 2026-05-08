import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { LayoutService } from '../../shared/services/layout.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { NotificationsDropdownComponent } from '../notifications/notifications-dropdown.component';
import { ProfileDropdownComponent } from '../profile-dropdown/profile-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, ThemeSwitcherComponent, NotificationsDropdownComponent, ProfileDropdownComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly layoutService = inject(LayoutService);
  readonly searchFocused = signal(false);
}
