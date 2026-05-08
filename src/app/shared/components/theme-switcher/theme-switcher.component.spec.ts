import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LucideAngularModule, Monitor, Moon, Sun } from 'lucide-angular';
import { ThemeSwitcherComponent } from './theme-switcher.component';
import { ThemeService } from '../../../core/theme/theme.service';

describe('ThemeSwitcherComponent', () => {
  let fixture: ComponentFixture<ThemeSwitcherComponent>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSwitcherComponent],
      providers: [
        importProvidersFrom(LucideAngularModule.pick({ Sun, Moon, Monitor })),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call themeService.setMode with "dark" when Dark button clicked', () => {
    spyOn(themeService, 'setMode');
    const buttons = fixture.nativeElement.querySelectorAll('button[aria-label]');
    const darkBtn = Array.from(buttons).find((b: Element) =>
      (b as HTMLElement).getAttribute('aria-label') === 'Dark mode'
    ) as HTMLElement | undefined;
    darkBtn?.click();
    expect(themeService.setMode).toHaveBeenCalledWith('dark');
  });

  it('should call themeService.setMode with "light" when Light button clicked', () => {
    spyOn(themeService, 'setMode');
    const buttons = fixture.nativeElement.querySelectorAll('button[aria-label]');
    const lightBtn = Array.from(buttons).find((b: Element) =>
      (b as HTMLElement).getAttribute('aria-label') === 'Light mode'
    ) as HTMLElement | undefined;
    lightBtn?.click();
    expect(themeService.setMode).toHaveBeenCalledWith('light');
  });

  it('should call themeService.setPalette with "emerald" when Emerald swatch clicked', () => {
    spyOn(themeService, 'setPalette');
    const buttons = fixture.nativeElement.querySelectorAll('button[aria-label]');
    const emeraldBtn = Array.from(buttons).find((b: Element) =>
      (b as HTMLElement).getAttribute('aria-label') === 'Emerald palette'
    ) as HTMLElement | undefined;
    emeraldBtn?.click();
    expect(themeService.setPalette).toHaveBeenCalledWith('emerald');
  });

  it('should call themeService.setPalette with "violet" when Violet swatch clicked', () => {
    spyOn(themeService, 'setPalette');
    const buttons = fixture.nativeElement.querySelectorAll('button[aria-label]');
    const violetBtn = Array.from(buttons).find((b: Element) =>
      (b as HTMLElement).getAttribute('aria-label') === 'Violet palette'
    ) as HTMLElement | undefined;
    violetBtn?.click();
    expect(themeService.setPalette).toHaveBeenCalledWith('violet');
  });
});
