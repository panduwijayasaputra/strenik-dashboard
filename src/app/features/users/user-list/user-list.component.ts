import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-list',
  standalone: true,
  template: '<p>User List</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {}
