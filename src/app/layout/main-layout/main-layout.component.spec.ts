import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  Activity,
  Bell,
  Building,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LayoutList,
  List,
  LogOut,
  LucideAngularModule,
  Menu,
  Monitor,
  Moon,
  Package,
  PanelLeft,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  User,
  UserPlus,
  Users,
  PlusCircle,
  X,
} from 'lucide-angular';
import { MainLayoutComponent } from './main-layout.component';
import { LayoutService } from '../../shared/services/layout.service';

describe('MainLayoutComponent', () => {
  let fixture: ComponentFixture<MainLayoutComponent>;
  let component: MainLayoutComponent;
  let layoutService: LayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        provideRouter([]),
        provideAnimations(),
        importProvidersFrom(
          LucideAngularModule.pick({
            Activity, Bell, Building, ChevronLeft, ChevronRight, LayoutDashboard, LayoutList, List,
            LogOut, Menu, Monitor, Moon, Package, PanelLeft, RefreshCw,
            Search, Settings, ShieldCheck, Sun, User, UserPlus, Users, PlusCircle, X,
          }),
        ),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
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

  it('should render the header', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-header')).toBeTruthy();
  });

  it('should render a router-outlet', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });

  it('should render the mobile drawer overlay (always in DOM)', () => {
    const el = fixture.nativeElement as HTMLElement;
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
