import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NavItem } from '../../../shared/models/nav-item.model';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './nav-item.component.html',
})
export class NavItemComponent {
  item = input.required<NavItem>();
  mini = input<boolean>(false);
}
