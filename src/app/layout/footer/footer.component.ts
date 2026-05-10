import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-base-300 bg-base-100 px-6 py-4 text-center text-sm text-base-content/60">
      &copy; {{ year }} Strenik. All rights reserved.
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
