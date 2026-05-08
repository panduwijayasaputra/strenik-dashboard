import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type ProgressBarColor = 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-3">
      <div
        role="progressbar"
        [attr.aria-valuenow]="value"
        aria-valuemin="0"
        aria-valuemax="100"
        class="flex-1 h-2 rounded-full bg-muted overflow-hidden"
      >
        <div
          class="h-full rounded-full transition-all duration-300"
          [class]="colorClass"
          [style.width.%]="clampedValue"
        ></div>
      </div>
      @if (showLabel) {
        <span class="text-sm tabular-nums text-muted-foreground w-9 text-right">{{ clampedValue }}%</span>
      }
    </div>
  `,
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() color: ProgressBarColor = 'primary';
  @Input() showLabel = false;

  get clampedValue(): number {
    return Math.min(100, Math.max(0, this.value));
  }

  get colorClass(): string {
    const map: Record<ProgressBarColor, string> = {
      primary: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-danger',
    };
    return map[this.color];
  }
}
