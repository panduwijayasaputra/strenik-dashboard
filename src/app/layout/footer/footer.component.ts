import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-border bg-card px-6 py-4 text-center text-sm text-muted-foreground">
      &copy; {{ year }} Strenik. All rights reserved.
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
