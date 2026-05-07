import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: '<p>Profile</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {}
