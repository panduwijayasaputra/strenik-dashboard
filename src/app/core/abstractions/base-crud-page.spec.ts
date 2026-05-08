import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BaseCrudPage } from './base-crud-page';
import { ConfirmDialogService } from './confirm-dialog.service';

interface User {
  id: number;
  name: string;
}

class TestCrudPage extends BaseCrudPage<User> {
  loadItemsCalled = false;
  deleteItemCalled = false;
  lastDeletedId: string | number | null = null;

  loadItems(): void {
    this.loadItemsCalled = true;
    this.loading.set(false);
    this.items.set([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
  }

  protected deleteItem(id: string | number): void {
    this.deleteItemCalled = true;
    this.lastDeletedId = id;
  }
}

describe('BaseCrudPage', () => {
  let page: TestCrudPage;
  let confirmDialogSpy: jasmine.SpyObj<ConfirmDialogService>;

  beforeEach(() => {
    confirmDialogSpy = jasmine.createSpyObj('ConfirmDialogService', ['open']);
    confirmDialogSpy.open.and.returnValue(of(true));

    TestBed.configureTestingModule({
      providers: [
        TestCrudPage,
        { provide: ConfirmDialogService, useValue: confirmDialogSpy },
      ],
    });

    page = TestBed.inject(TestCrudPage);
  });

  it('ngOnInit sets loading to true and calls loadItems()', () => {
    page.ngOnInit();
    expect(page.loadItemsCalled).toBeTrue();
    // loadItems sets loading back to false in our stub
    expect(page.loading()).toBeFalse();
  });

  it('initial signal values are correct', () => {
    expect(page.items()).toEqual([]);
    expect(page.loading()).toBeFalse();
    expect(page.selectedItem()).toBeNull();
    expect(page.error()).toBeNull();
  });

  it('onCreateSuccess appends item to items', () => {
    page.items.set([{ id: 1, name: 'Alice' }]);
    page.onCreateSuccess({ id: 2, name: 'Bob' });
    expect(page.items()).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
  });

  it('onUpdateSuccess replaces the matching item', () => {
    page.items.set([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
    page.onUpdateSuccess({ id: 1, name: 'Alice Updated' });
    expect(page.items()).toEqual([
      { id: 1, name: 'Alice Updated' },
      { id: 2, name: 'Bob' },
    ]);
  });

  it('onDeleteSuccess removes the item with matching id', () => {
    page.items.set([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
    page.onDeleteSuccess(1);
    expect(page.items()).toEqual([{ id: 2, name: 'Bob' }]);
  });

  it('confirmDelete calls ConfirmDialogService.open with danger: true', () => {
    page.confirmDelete(1).subscribe();
    expect(confirmDialogSpy.open).toHaveBeenCalledWith(
      jasmine.objectContaining({ danger: true }),
    );
  });

  it('confirmDelete returns Observable<boolean>', done => {
    confirmDialogSpy.open.and.returnValue(of(true));
    page.confirmDelete(1).subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });
});
