import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bg-card border border-border rounded-lg"
      [class.shadow-md]="elevated"
      [class.shadow-sm]="!elevated"
    >
      <div class="px-6 py-4 border-b border-border empty:hidden">
        <ng-content select="[card-header]" />
      </div>
      <div [class.p-6]="!noPadding">
        <ng-content select="[card-body]" />
      </div>
      <div class="px-6 py-4 border-t border-border empty:hidden">
        <ng-content select="[card-footer]" />
      </div>
    </div>
  `,
})
export class CardComponent {
  @Input() noPadding = false;
  @Input() elevated = false;
}
