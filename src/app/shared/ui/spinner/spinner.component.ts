import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerColor = 'primary' | 'white' | 'muted';

@Component({
  selector: 'app-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span role="status" class="inline-flex">
      <span
        class="animate-spin rounded-full border-2 border-t-transparent"
        [class]="sizeClass + ' ' + colorClass"
        aria-hidden="true"
      ></span>
      <span class="sr-only">Loading</span>
    </span>
  `,
})
export class SpinnerComponent {
  @Input() size: SpinnerSize = 'md';
  @Input() color: SpinnerColor = 'primary';

  get sizeClass(): string {
    const map: Record<SpinnerSize, string> = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-10 h-10',
    };
    return map[this.size];
  }

  get colorClass(): string {
    const map: Record<SpinnerColor, string> = {
      primary: 'border-primary',
      white: 'border-white',
      muted: 'border-muted-foreground',
    };
    return map[this.color];
  }
}
