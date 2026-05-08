import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-verification-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Verification modal — coming soon.</p>`,
})
export class VerificationModalComponent {}
