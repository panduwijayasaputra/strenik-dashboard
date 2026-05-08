import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  List,
  LogOut,
  LucideAngularModule,
  Menu,
  Monitor,
  Moon,
  Package,
  RefreshCw,
  Search,
  Settings,
  Sun,
  User,
  UserPlus,
  Users,
  PlusCircle,
} from 'lucide-angular';
import { AdminLayoutComponent } from './admin-layout.component';
import { LayoutService } from '../../core/services/layout.service';

describe('AdminLayoutComponent', () => {
  let fixture: ComponentFixture<AdminLayoutComponent>;
  let component: AdminLayoutComponent;
  let layoutService: LayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
      providers: [
        provideRouter([]),
        provideAnimations(),
        importProvidersFrom(
          LucideAngularModule.pick({
            Bell, ChevronLeft, ChevronRight, LayoutDashboard, List,
            LogOut, Menu, Monitor, Moon, Package, RefreshCw, Search,
            Settings, Sun, User, UserPlus, Users, PlusCircle,
          }),
        ),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(LayoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the sidebar', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-sidebar')).toBeTruthy();
  });

  it('should render the top navbar', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-top-navbar')).toBeTruthy();
  });

  it('should render a router-outlet', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });

  it('should render the mobile drawer overlay (always in DOM)', () => {
    const el = fixture.nativeElement as HTMLElement;
    // Overlay is always in DOM; CSS opacity controls visibility
    const overlay = el.querySelector('.fixed.inset-0.z-40');
    expect(overlay).toBeTruthy();
  });

  it('should have opacity-0 on overlay when drawer is closed', () => {
    layoutService.closeMobileDrawer();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const overlay = el.querySelector('.fixed.inset-0.z-40') as HTMLElement;
    expect(overlay.classList).toContain('opacity-0');
  });

  it('should have opacity-100 on overlay when drawer is open', () => {
    layoutService.openMobileDrawer();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const overlay = el.querySelector('.fixed.inset-0.z-40') as HTMLElement;
    expect(overlay.classList).toContain('opacity-100');
  });

  it('should close the drawer when the backdrop is clicked', () => {
    layoutService.openMobileDrawer();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const backdrop = el.querySelector<HTMLElement>('.fixed.inset-0.z-40');
    backdrop?.click();
    fixture.detectChanges();

    expect(layoutService.mobileDrawerOpen()).toBeFalse();
  });
});
