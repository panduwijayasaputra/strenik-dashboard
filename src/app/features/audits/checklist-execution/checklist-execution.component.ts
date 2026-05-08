import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-checklist-execution',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Checklist execution — coming soon.</p>`,
})
export class ChecklistExecutionComponent {}
