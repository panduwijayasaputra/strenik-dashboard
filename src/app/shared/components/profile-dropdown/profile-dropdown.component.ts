import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatMenuModule, MatDividerModule, RouterLink, LucideAngularModule],
  templateUrl: './profile-dropdown.component.html',
})
export class ProfileDropdownComponent {
  readonly authService = inject(AuthService);
}
