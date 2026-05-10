import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <ng-content />
    </div>
  `,
})
export class CardComponent {}
