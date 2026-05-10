import { Directive, Input } from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
  hostDirectives: [
    {
      directive: MatTooltip,
      inputs: ['matTooltip: appTooltip', 'matTooltipPosition: tooltipPosition'],
    },
  ],
})
export class TooltipDirective {
  @Input('appTooltip') tooltip = '';
  @Input() tooltipPosition: TooltipPosition = 'above';
}
