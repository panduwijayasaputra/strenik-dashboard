import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-activity-log-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Activity logs — coming soon.</p>`,
})
export class ActivityLogListComponent {}
