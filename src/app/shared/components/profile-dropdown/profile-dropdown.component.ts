import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './profile-dropdown.component.html',
})
export class ProfileDropdownComponent {
  readonly authService = inject(AuthService);
  readonly isOpen = signal(false);

  toggle(): void { this.isOpen.update(v => !v); }
  close(): void { this.isOpen.set(false); }
}
