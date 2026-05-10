import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-organization-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Organization settings — coming soon.</p>`,
})
export class OrganizationSettingsComponent {}
