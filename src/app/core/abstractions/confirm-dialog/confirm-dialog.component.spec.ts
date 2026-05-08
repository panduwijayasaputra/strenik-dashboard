import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogConfig } from '../models/base.models';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  function setup(config: ConfirmDialogConfig): void {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: config },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    });

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('renders title and message', () => {
    setup({ title: 'Delete User', message: 'Are you sure?' });
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Delete User');
    expect(compiled.textContent).toContain('Are you sure?');
  });

  it('confirm button calls dialogRef.close(true)', () => {
    setup({ title: 'Confirm', message: 'Proceed?' });
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const confirmBtn = Array.from<HTMLButtonElement>(buttons).find(b =>
      b.textContent?.trim() === 'Confirm',
    ) as HTMLButtonElement;
    confirmBtn.click();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('cancel button calls dialogRef.close(false)', () => {
    setup({ title: 'Confirm', message: 'Proceed?' });
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const cancelBtn = Array.from<HTMLButtonElement>(buttons).find(b =>
      b.textContent?.trim() === 'Cancel',
    ) as HTMLButtonElement;
    cancelBtn.click();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('uses custom confirmLabel and cancelLabel', () => {
    setup({ title: 'Remove', message: 'Sure?', confirmLabel: 'Yes, remove', cancelLabel: 'No' });
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Yes, remove');
    expect(compiled.textContent).toContain('No');
  });

  it('applies danger class to confirm button when danger is true', () => {
    setup({ title: 'Delete', message: 'This is destructive', danger: true });
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const confirmBtn = Array.from<HTMLButtonElement>(buttons).find(b =>
      b.textContent?.trim() === 'Confirm',
    ) as HTMLButtonElement;
    expect(confirmBtn.classList).toContain('bg-danger');
  });

  it('applies primary class to confirm button when danger is false', () => {
    setup({ title: 'Save', message: 'Save changes?', danger: false });
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const confirmBtn = Array.from<HTMLButtonElement>(buttons).find(b =>
      b.textContent?.trim() === 'Confirm',
    ) as HTMLButtonElement;
    expect(confirmBtn.classList).toContain('bg-primary');
  });
});
