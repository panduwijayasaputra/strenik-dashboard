import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfirmDialogService } from './confirm-dialog.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpy as never);

    TestBed.configureTestingModule({
      providers: [
        ConfirmDialogService,
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });

    service = TestBed.inject(ConfirmDialogService);
  });

  it('calls MatDialog.open with ConfirmDialogComponent and config', () => {
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    const config = { title: 'Delete', message: 'Sure?' };

    service.open(config).subscribe();

    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: config,
      width: '400px',
      disableClose: false,
    });
  });

  it('returns true when dialog closes with true', done => {
    dialogRefSpy.afterClosed.and.returnValue(of(true));

    service.open({ title: 'T', message: 'M' }).subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('returns false when dialog closes with false', done => {
    dialogRefSpy.afterClosed.and.returnValue(of(false));

    service.open({ title: 'T', message: 'M' }).subscribe(result => {
      expect(result).toBe(false);
      done();
    });
  });

  it('returns false when dialog is dismissed (undefined)', done => {
    dialogRefSpy.afterClosed.and.returnValue(of(undefined));

    service.open({ title: 'T', message: 'M' }).subscribe(result => {
      expect(result).toBe(false);
      done();
    });
  });
});
