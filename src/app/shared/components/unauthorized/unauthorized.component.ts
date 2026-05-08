import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full flex-col items-center justify-center gap-4 text-center p-8">
      <h2 class="text-2xl font-bold text-foreground">Access Denied</h2>
      <p class="text-muted-foreground">You do not have permission to view this page.</p>
    </div>
  `,
})
export class UnauthorizedComponent {}
