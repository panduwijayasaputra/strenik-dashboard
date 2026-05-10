import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-remediation-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Remediation modal — coming soon.</p>`,
})
export class RemediationModalComponent {}
