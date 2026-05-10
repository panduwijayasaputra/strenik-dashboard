import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-card border border-border rounded-lg shadow-lg p-4">
      <ng-content />
    </div>
  `,
})
export class PopoverComponent {}
