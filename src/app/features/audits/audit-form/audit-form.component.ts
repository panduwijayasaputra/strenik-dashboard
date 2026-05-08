import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-audit-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Audit form — coming soon.</p>`,
})
export class AuditFormComponent {}
