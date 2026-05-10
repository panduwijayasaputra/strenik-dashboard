import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-finding-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Finding list — coming soon.</p>`,
})
export class FindingListComponent {}
