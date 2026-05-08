import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ConfirmDialogConfig } from './models/base.models';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  open(config: ConfirmDialogConfig): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: config,
      width: '400px',
      disableClose: false,
    });
    return dialogRef.afterClosed().pipe(map(result => result === true));
  }
}
