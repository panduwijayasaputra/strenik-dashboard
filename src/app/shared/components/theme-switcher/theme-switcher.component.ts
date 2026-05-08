import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<!-- ThemeSwitcher: implemented in task 4.0 -->`,
})
export class ThemeSwitcherComponent {
  variant = input<'navbar' | 'sidebar'>('navbar');
}
