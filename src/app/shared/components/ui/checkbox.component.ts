import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <label class="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" class="h-4 w-4 rounded border-input accent-primary" [(ngModel)]="checked" />
      <ng-content />
    </label>
  `,
})
export class CheckboxComponent {
  checked = model(false);
}
