import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Notification bell — coming soon.</p>`,
})
export class NotificationBellComponent {}
