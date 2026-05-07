import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-users',
  standalone: true,
  template: '<p>Users</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {}
