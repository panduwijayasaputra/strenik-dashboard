import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { LayoutService } from '../../services/layout.service';

describe('AdminLayoutComponent', () => {
  let fixture: ComponentFixture<AdminLayoutComponent>;
  let component: AdminLayoutComponent;
  let layoutService: LayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
      providers: [provideRouter([])],
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

  it('should not show the mobile drawer overlay when closed', () => {
    layoutService.closeMobileDrawer();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    // Overlay is inside an @if block — it should not be present in the DOM
    const backdrop = el.querySelector('.fixed.inset-0.z-40');
    expect(backdrop).toBeNull();
  });

  it('should show the mobile drawer overlay when open', () => {
    layoutService.openMobileDrawer();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const backdrop = el.querySelector('.fixed.inset-0.z-40');
    expect(backdrop).toBeTruthy();
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
