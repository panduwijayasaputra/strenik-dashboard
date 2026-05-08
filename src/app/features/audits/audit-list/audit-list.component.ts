import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-audit-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Audit list — coming soon.</p>`,
})
export class AuditListComponent {}
