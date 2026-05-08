import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  template: '<p>Product List</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {}
