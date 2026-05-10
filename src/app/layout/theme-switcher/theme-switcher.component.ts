import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeName, ThemeService } from '../../shared/services/theme.service';

interface ThemeOption { value: ThemeName; icon: string; label: string; }

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  templateUrl: './theme-switcher.component.html',
})
export class ThemeSwitcherComponent {
  variant = input<'navbar' | 'sidebar'>('navbar');

  readonly themeService = inject(ThemeService);

  readonly isOpen = signal(false);

  readonly themes: ThemeOption[] = [
    { value: 'light', icon: 'sun',  label: 'Light' },
    { value: 'dark',  icon: 'moon', label: 'Dark'  },
  ];

  readonly activeIcon = computed(
    () => this.themes.find(t => t.value === this.themeService.theme())?.icon ?? 'sun'
  );

  toggle(): void { this.isOpen.update(v => !v); }
  close(): void { this.isOpen.set(false); }
}
