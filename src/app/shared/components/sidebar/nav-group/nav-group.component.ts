import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavItem } from '../../../../core/navigation/nav-item.model';
import { NavItemComponent } from '../nav-item/nav-item.component';

@Component({
  selector: 'app-nav-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLinkActive, LucideAngularModule, MatTooltipModule, NavItemComponent],
  templateUrl: './nav-group.component.html',
})
export class NavGroupComponent {
  item = input.required<NavItem>();
  mini = input<boolean>(false);

  isOpen = signal<boolean>(false);

  toggle(): void {
    this.isOpen.update(v => !v);
  }
}
