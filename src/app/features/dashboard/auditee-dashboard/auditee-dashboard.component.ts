import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auditee-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Auditee dashboard — coming soon.</p>`,
})
export class AuditeeDashboardComponent {}
