import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-audit-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Audit detail — coming soon.</p>`,
})
export class AuditDetailComponent {}
