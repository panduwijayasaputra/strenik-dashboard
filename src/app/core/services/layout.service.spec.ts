import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sidebarExpanded', () => {
    it('should default to true', () => {
      expect(service.sidebarExpanded()).toBeTrue();
    });

    it('toggleSidebar() should set it to false when currently true', () => {
      service.toggleSidebar();
      expect(service.sidebarExpanded()).toBeFalse();
    });

    it('toggleSidebar() should set it back to true when called again', () => {
      service.toggleSidebar();
      service.toggleSidebar();
      expect(service.sidebarExpanded()).toBeTrue();
    });
  });

  describe('mobileDrawerOpen', () => {
    it('should default to false', () => {
      expect(service.mobileDrawerOpen()).toBeFalse();
    });

    it('openMobileDrawer() should set it to true', () => {
      service.openMobileDrawer();
      expect(service.mobileDrawerOpen()).toBeTrue();
    });

    it('closeMobileDrawer() should set it to false', () => {
      service.openMobileDrawer();
      service.closeMobileDrawer();
      expect(service.mobileDrawerOpen()).toBeFalse();
    });

    it('closeMobileDrawer() should be a no-op when already closed', () => {
      service.closeMobileDrawer();
      expect(service.mobileDrawerOpen()).toBeFalse();
    });
  });
});
