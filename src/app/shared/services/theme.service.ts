import { Injectable, signal, effect } from '@angular/core';

export type ThemeName = 'light' | 'dark';

const THEME_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemeName>(
    (localStorage.getItem(THEME_KEY) as ThemeName) ?? 'light'
  );

  constructor() {
    effect(() => {
      const theme = this.theme();
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  setTheme(theme: ThemeName): void {
    this.theme.set(theme);
  }
}
