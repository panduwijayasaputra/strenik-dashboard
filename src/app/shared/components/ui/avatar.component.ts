import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
      {{ initials() }}
    </div>
  `,
})
export class AvatarComponent {
  name = input('');
  initials() { return this.name().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
}
