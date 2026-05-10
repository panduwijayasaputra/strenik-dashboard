import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-audit-template-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Audit templates — coming soon.</p>`,
})
export class AuditTemplateListComponent {}
