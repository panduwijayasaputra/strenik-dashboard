import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeMode, ThemePalette, ThemeService } from '../../shared/services/theme.service';

interface ModeOption { value: ThemeMode; icon: string; label: string; }
interface PaletteOption { value: ThemePalette; color: string; label: string; }

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

  readonly modes: ModeOption[] = [
    { value: 'light',  icon: 'sun',     label: 'Light'  },
    { value: 'dark',   icon: 'moon',    label: 'Dark'   },
    { value: 'system', icon: 'monitor', label: 'System' },
  ];

  readonly palettes: PaletteOption[] = [
    { value: 'blue',    color: '#2563eb', label: 'Blue'    },
    { value: 'emerald', color: '#059669', label: 'Emerald' },
    { value: 'violet',  color: '#7c3aed', label: 'Violet'  },
    { value: 'amber',   color: '#d97706', label: 'Amber'   },
    { value: 'slate',   color: '#475569', label: 'Slate'   },
  ];

  readonly activeModeIcon = computed(
    () => this.modes.find(m => m.value === this.themeService.mode())?.icon ?? 'sun'
  );

  toggle(): void { this.isOpen.update(v => !v); }
  close(): void { this.isOpen.set(false); }
}
