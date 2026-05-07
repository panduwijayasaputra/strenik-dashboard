import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  template: '<p>Products</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {}
