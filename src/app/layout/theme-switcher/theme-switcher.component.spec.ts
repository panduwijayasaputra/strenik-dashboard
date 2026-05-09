import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';
import { ThemeSwitcherComponent } from './theme-switcher.component';
import { ThemeService } from '../../shared/services/theme.service';

describe('ThemeSwitcherComponent', () => {
  let fixture: ComponentFixture<ThemeSwitcherComponent>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSwitcherComponent],
      providers: [
        importProvidersFrom(LucideAngularModule.pick({ Sun, Moon })),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    fixture.componentRef.setInput('variant', 'sidebar');
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render only light and dark theme buttons', () => {
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('button[aria-label]');
    const labels = Array.from(buttons).map(b => b.getAttribute('aria-label'));
    expect(labels).toContain('Light theme');
    expect(labels).toContain('Dark theme');
    expect(labels.length).toBe(2);
  });

  it('should call themeService.setTheme with "dark" when Dark button clicked', () => {
    spyOn(themeService, 'setTheme');
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('button[aria-label]');
    const darkBtn = Array.from(buttons).find(b =>
      b.getAttribute('aria-label') === 'Dark theme'
    );
    darkBtn?.click();
    expect(themeService.setTheme).toHaveBeenCalledWith('dark');
  });

  it('should call themeService.setTheme with "light" when Light button clicked', () => {
    spyOn(themeService, 'setTheme');
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('button[aria-label]');
    const lightBtn = Array.from(buttons).find(b =>
      b.getAttribute('aria-label') === 'Light theme'
    );
    lightBtn?.click();
    expect(themeService.setTheme).toHaveBeenCalledWith('light');
  });

  it('should expose light and dark as the only theme options', () => {
    const component = fixture.componentInstance;
    expect(component.themes.map(t => t.value)).toEqual(['light', 'dark']);
  });
});
