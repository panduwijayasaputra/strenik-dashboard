import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit {
  @Input() hasPermission: string[] = [];

  private templateRef = inject(TemplateRef<unknown>);
  private vcr = inject(ViewContainerRef);
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (this.authService.hasRole(this.hasPermission)) {
      this.vcr.createEmbeddedView(this.templateRef);
    } else {
      this.vcr.clear();
    }
  }
}
