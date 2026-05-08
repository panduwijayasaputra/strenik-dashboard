import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">User form — coming soon.</p>`,
})
export class UserFormComponent {}
