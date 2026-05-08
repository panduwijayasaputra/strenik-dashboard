import { inject, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmDialogService } from './confirm-dialog.service';

export abstract class BaseCrudPage<T extends { id: string | number }> implements OnInit {
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly items = signal<T[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selectedItem = signal<T | null>(null);
  readonly error = signal<string | null>(null);

  abstract loadItems(): void;

  ngOnInit(): void {
    this.loading.set(true);
    this.loadItems();
  }

  onCreateSuccess(item: T): void {
    this.items.update(current => [...current, item]);
  }

  onUpdateSuccess(updated: T): void {
    this.items.update(current =>
      current.map(item => (item.id === updated.id ? updated : item)),
    );
  }

  onDeleteSuccess(id: string | number): void {
    this.items.update(current => current.filter(item => item.id !== id));
  }

  confirmDelete(id: string | number): Observable<boolean> {
    return this.confirmDialog.open({
      title: 'Delete',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
  }

  protected abstract deleteItem(id: string | number): void;
}
