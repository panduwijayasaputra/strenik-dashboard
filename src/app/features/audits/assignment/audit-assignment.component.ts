import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-audit-assignment',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Audit assignment — coming soon.</p>`,
})
export class AuditAssignmentComponent {}
