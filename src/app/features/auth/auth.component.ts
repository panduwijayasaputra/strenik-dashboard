import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  template: '<p>Auth</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {}
