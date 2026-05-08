import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly sidebarExpanded = signal<boolean>(true);
  readonly mobileDrawerOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.sidebarExpanded.update(v => !v);
  }

  openMobileDrawer(): void {
    this.mobileDrawerOpen.set(true);
  }

  closeMobileDrawer(): void {
    this.mobileDrawerOpen.set(false);
  }
}
