import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
// Icons are registered globally via LucideAngularModule.pick() in app.config.ts
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavItem } from '../../../../core/navigation/nav-item.model';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, MatTooltipModule],
  templateUrl: './nav-item.component.html',
})
export class NavItemComponent {
  item = input.required<NavItem>();
  mini = input<boolean>(false);
}
