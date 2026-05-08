// STUB — for reference only. Not for production use.
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseTableComponent } from '../base-table.component';
import { User } from './stub-users.service';

/**
 * STUB table component extending BaseTableComponent.
 * Demonstrates the minimal setup needed for a typed table:
 *   1. Extend BaseTableComponent<T>
 *   2. Set this.columns in ngOnInit
 *   3. Project matColumnDef definitions via ng-content into <app-base-table>
 *
 * In a real feature, the parent page component would use <app-base-table>
 * directly and handle pageChange/sortChange/rowSelect events.
 */
@Component({
  selector: 'app-stub-users-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaseTableComponent],
  template: `
    <app-base-table
      [data]="data"
      [loading]="loading"
      [totalItems]="totalItems"
      [pageSize]="pageSize"
      [pageIndex]="pageIndex"
      [columns]="columns"
      (pageChange)="pageChange.emit($event)"
      (sortChange)="sortChange.emit($event)"
      (filterChange)="filterChange.emit($event)"
      (rowSelect)="rowSelect.emit($event)"
    >
      <ng-container matColumnDef="name">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
        <mat-cell *matCellDef="let row">{{ row.name }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="email">
        <mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
        <mat-cell *matCellDef="let row">{{ row.email }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="role">
        <mat-header-cell *matHeaderCellDef>Role</mat-header-cell>
        <mat-cell *matCellDef="let row">{{ row.role }}</mat-cell>
      </ng-container>
    </app-base-table>
  `,
})
export class StubUsersTableComponent extends BaseTableComponent<User> implements OnInit {
  ngOnInit(): void {
    this.columns = ['name', 'email', 'role'];
  }
}
