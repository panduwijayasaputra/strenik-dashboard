import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-audit-template-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Audit template form — coming soon.</p>`,
})
export class AuditTemplateFormComponent {}
