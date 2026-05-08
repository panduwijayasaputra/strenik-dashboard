import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { NavItem } from '../../../models/nav-item.model';
import { NavItemComponent } from '../nav-item/nav-item.component';

@Component({
  selector: 'app-nav-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, NavItemComponent],
  templateUrl: './nav-group.component.html',
})
export class NavGroupComponent {
  item = input.required<NavItem>();
  mini = input<boolean>(false);

  isOpen = signal<boolean>(false);

  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  readonly hasActiveChild = computed(() =>
    this.item().children?.some(c => c.route && this.currentUrl().includes(c.route)) ?? false
  );

  toggle(): void {
    this.isOpen.update(v => !v);
  }
}
