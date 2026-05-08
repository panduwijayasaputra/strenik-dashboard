import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-finding-form-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-6 text-muted-foreground">Finding form — coming soon.</p>`,
})
export class FindingFormModalComponent {}
