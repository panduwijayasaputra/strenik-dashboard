import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-organization-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Organization form — coming soon.</p>`,
})
export class OrganizationFormComponent {}
