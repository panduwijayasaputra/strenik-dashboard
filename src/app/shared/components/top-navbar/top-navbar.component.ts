import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <header class="flex h-16 flex-shrink-0 items-center gap-4 border-b border-border bg-surface px-4">
      <!-- Hamburger (mobile only) -->
      <button
        type="button"
        class="lg:hidden flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Open navigation menu"
        (click)="layoutService.openMobileDrawer()"
      >
        <lucide-icon name="menu" [size]="20" />
      </button>

      <!-- Spacer — remaining navbar content implemented in task 4.5 -->
      <div class="flex-1"></div>
    </header>
  `,
})
export class TopNavbarComponent {
  readonly layoutService = inject(LayoutService);
}
