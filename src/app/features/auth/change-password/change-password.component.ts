import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-change-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Change password — coming soon.</p>`,
})
export class ChangePasswordComponent {}
