import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-severity-level-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Severity level form — coming soon.</p>`,
})
export class SeverityLevelFormComponent {}
