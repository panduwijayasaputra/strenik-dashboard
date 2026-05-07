import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: '<p>404 - Page Not Found</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
