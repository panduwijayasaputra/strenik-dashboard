import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Notification list — coming soon.</p>`,
})
export class NotificationListComponent {}
