import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemePalette = 'blue' | 'emerald' | 'violet' | 'amber' | 'slate';

const MODE_KEY = 'theme-mode';
const PALETTE_KEY = 'theme-palette';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(
    (localStorage.getItem(MODE_KEY) as ThemeMode) ?? 'system'
  );

  readonly palette = signal<ThemePalette>(
    (localStorage.getItem(PALETTE_KEY) as ThemePalette) ?? 'blue'
  );

  constructor() {
    effect(() => {
      const mode = this.mode();
      localStorage.setItem(MODE_KEY, mode);
      this.applyMode(mode);
    });

    effect(() => {
      const palette = this.palette();
      localStorage.setItem(PALETTE_KEY, palette);
      document.documentElement.setAttribute('data-palette', palette);
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  setPalette(palette: ThemePalette): void {
    this.palette.set(palette);
  }

  private applyMode(mode: ThemeMode): void {
    const html = document.documentElement;
    if (mode === 'dark') {
      html.classList.add('dark');
    } else if (mode === 'light') {
      html.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.toggle('dark', prefersDark);
    }
  }
}
