import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-severity-level-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Severity levels — coming soon.</p>`,
})
export class SeverityLevelListComponent {}
