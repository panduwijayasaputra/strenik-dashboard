import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { LogOut, LucideAngularModule, RefreshCw, Settings, ShieldCheck, User } from 'lucide-angular';
import { ProfileDropdownComponent } from './profile-dropdown.component';
import { AuthService } from '../../shared/services/auth.service';

describe('ProfileDropdownComponent', () => {
  let fixture: ComponentFixture<ProfileDropdownComponent>;
  let component: ProfileDropdownComponent;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDropdownComponent],
      providers: [
        provideRouter([]),
        provideAnimations(),
        importProvidersFrom(LucideAngularModule.pick({ User, Settings, RefreshCw, ShieldCheck, LogOut })),
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    // Seed a mock user
    authService.currentUser.set({
      id: '1',
      name: 'Test Admin',
      email: 'admin@test.com',
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    fixture = TestBed.createComponent(ProfileDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the avatar button with user initial', () => {
    const btn = fixture.nativeElement.querySelector('button[aria-label="Open profile menu"]');
    expect(btn).toBeTruthy();
    expect(btn.textContent.trim()).toBe('T');
  });

  it('should call authService.logout() on logout click', () => {
    spyOn(authService, 'logout');
    // Open menu and click logout
    const trigger = fixture.nativeElement.querySelector('button[aria-label="Open profile menu"]');
    trigger.click();
    fixture.detectChanges();

    const buttons = Array.from<HTMLButtonElement>(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button')
    );
    const logoutBtn = buttons.find(el => el.textContent?.includes('Logout'));

    logoutBtn?.click();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should call authService.switchDemoRole() on Switch Role click', () => {
    spyOn(authService, 'switchDemoRole');
    const trigger = fixture.nativeElement.querySelector('button[aria-label="Open profile menu"]');
    trigger.click();
    fixture.detectChanges();

    const buttons = Array.from<HTMLButtonElement>(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button')
    );
    const switchBtn = buttons.find(el => el.textContent?.includes('Switch Role'));

    switchBtn?.click();
    expect(authService.switchDemoRole).toHaveBeenCalled();
  });

  it('should not render avatar when user is null', () => {
    authService.currentUser.set(null);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button[aria-label="Open profile menu"]');
    expect(btn).toBeNull();
  });
});
