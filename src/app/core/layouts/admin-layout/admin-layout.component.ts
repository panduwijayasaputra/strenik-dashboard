import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { TopNavbarComponent } from '../../../shared/components/top-navbar/top-navbar.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';

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
