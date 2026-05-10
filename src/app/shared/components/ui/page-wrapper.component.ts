import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-wrapper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-base-content">{{ title() }}</h1>
          @if (subtitle()) {
            <p class="mt-1 text-sm text-base-content/60">{{ subtitle() }}</p>
          }
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <ng-content select="[pageActions]" />
        </div>
      </div>
      <ng-content />
    </div>
  `,
})
export class PageWrapperComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
