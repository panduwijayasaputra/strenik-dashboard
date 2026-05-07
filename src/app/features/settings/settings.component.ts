import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: '<p>Settings</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {}
