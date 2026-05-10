import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageWrapperComponent } from '../../../../shared/components/ui/page-wrapper.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageWrapperComponent],
  template: `
    <app-page-wrapper title="Users" subtitle="Manage system users">
      <button pageActions class="btn btn-primary btn-sm">+ Create User</button>
      <p class="text-base-content/60">User table goes here.</p>
    </app-page-wrapper>
  `,
})
export class UserListComponent {}
