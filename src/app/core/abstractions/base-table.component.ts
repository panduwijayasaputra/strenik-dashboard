import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-base-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule],
  template: `
    <div class="relative w-full overflow-hidden">
      <!-- Loading skeleton -->
      @if (loading) {
        <div class="flex flex-col gap-2 p-4" aria-label="Loading">
          @for (row of skeletonRows; track row) {
            <div class="h-10 w-full animate-pulse rounded bg-muted/40"></div>
          }
        </div>
      }

      <!-- Table -->
      @if (!loading) {
        <mat-table [dataSource]="data" matSort (matSortChange)="sortChange.emit($event)">
          <!-- Select column -->
          <ng-container matColumnDef="select">
            <mat-header-cell *matHeaderCellDef class="w-12">
              <mat-checkbox
                [checked]="allSelected"
                [indeterminate]="someSelected"
                (change)="toggleSelectAll($event)"
              />
            </mat-header-cell>
            <mat-cell *matCellDef="let row" class="w-12">
              <mat-checkbox
                [checked]="isSelected(row)"
                (change)="toggleRow(row, $event)"
              />
            </mat-cell>
          </ng-container>

          <!-- Feature column definitions projected here -->
          <ng-content />

          <mat-header-row *matHeaderRowDef="allColumns" />
          <mat-row *matRowDef="let row; columns: allColumns" />

          <!-- Empty state -->
          <tr class="mat-row" *matNoDataRow>
            <td class="p-8 text-center text-muted" [attr.colspan]="allColumns.length">
              <ng-content select="[empty-state]">No data available.</ng-content>
            </td>
          </tr>
        </mat-table>
      }

      <!-- Paginator -->
      @if (!loading) {
        <mat-paginator
          [length]="totalItems"
          [pageSize]="pageSize"
          [pageIndex]="pageIndex"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="pageChange.emit($event)"
        />
      }
    </div>
  `,
})
export class BaseTableComponent<T extends object> implements OnChanges {
  @Input() data: T[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  /** Column def names provided by the parent/subclass (excluding 'select'). */
  @Input() columns: string[] = [];

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() rowSelect = new EventEmitter<T[]>();

  protected readonly skeletonRows = Array.from({ length: 5 });
  protected selectedRows = new Set<T>();

  get allColumns(): string[] {
    return ['select', ...this.columns];
  }

  get allSelected(): boolean {
    return this.data.length > 0 && this.selectedRows.size === this.data.length;
  }

  get someSelected(): boolean {
    return this.selectedRows.size > 0 && this.selectedRows.size < this.data.length;
  }

  ngOnChanges(): void {
    // Clear selection when data changes
    this.selectedRows.clear();
    this.rowSelect.emit([]);
  }

  isSelected(row: T): boolean {
    return this.selectedRows.has(row);
  }

  toggleRow(row: T, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedRows.add(row);
    } else {
      this.selectedRows.delete(row);
    }
    this.rowSelect.emit([...this.selectedRows]);
  }

  toggleSelectAll(event: MatCheckboxChange): void {
    if (event.checked) {
      this.data.forEach(row => this.selectedRows.add(row));
    } else {
      this.selectedRows.clear();
    }
    this.rowSelect.emit([...this.selectedRows]);
  }
}
