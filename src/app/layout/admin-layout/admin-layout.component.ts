import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../core/services/layout.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, TopNavbarComponent, BreadcrumbComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  readonly layoutService = inject(LayoutService);
}
