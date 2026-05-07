import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<!-- Sidebar: implemented in task 2.0 -->`,
})
export class SidebarComponent {
  mobileMode = input<boolean>(false);
}
