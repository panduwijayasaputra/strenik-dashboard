import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(private dialog: MatDialog) {}

  open<T>(component: ComponentType<T>, config?: MatDialogConfig): MatDialogRef<T> {
    return this.dialog.open(component, config);
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}
