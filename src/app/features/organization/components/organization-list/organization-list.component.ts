import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-organization-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Organization list — coming soon.</p>`,
})
export class OrganizationListComponent {}
