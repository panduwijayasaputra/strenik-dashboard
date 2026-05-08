import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full flex-col items-center justify-center gap-4 text-center p-8">
      <h2 class="text-2xl font-bold text-foreground">404 — Page Not Found</h2>
      <p class="text-muted-foreground">The page you are looking for does not exist.</p>
    </div>
  `,
})
export class NotFoundComponent {}
