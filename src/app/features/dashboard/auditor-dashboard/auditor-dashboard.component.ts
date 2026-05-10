import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auditor-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Auditor dashboard — coming soon.</p>`,
})
export class AuditorDashboardComponent {}
