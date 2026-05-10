import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="'animate-spin rounded-full border-2 border-muted border-t-primary ' + sizeClass()"></div>`,
})
export class SpinnerComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
  sizeClass() { return { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }[this.size()]; }
}
