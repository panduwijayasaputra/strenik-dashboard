import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button [class]="buttonClass()" [disabled]="disabled()" (click)="clicked.emit()">
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  clicked = output<void>();

  buttonClass() {
    const base = 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none disabled:opacity-50';
    const variants: Record<string, string> = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      danger: 'bg-danger text-white hover:bg-danger/90',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    };
    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  }
}
