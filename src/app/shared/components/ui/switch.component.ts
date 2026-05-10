import { ChangeDetectionStrategy, Component, model } from '@angular/core';

@Component({
  selector: 'app-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" role="switch" [attr.aria-checked]="checked()"
      [class]="checked() ? 'bg-primary' : 'bg-muted'"
      class="relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors"
      (click)="checked.set(!checked())">
      <span [class]="checked() ? 'translate-x-4' : 'translate-x-0'"
        class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"></span>
    </button>
  `,
})
export class SwitchComponent {
  checked = model(false);
}
