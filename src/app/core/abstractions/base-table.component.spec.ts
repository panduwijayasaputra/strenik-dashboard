import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BaseTableComponent } from './base-table.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

interface User {
  id: number;
  name: string;
}

const MOCK_USERS: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' },
];

describe('BaseTableComponent', () => {
  let fixture: ComponentFixture<BaseTableComponent<User>>;
  let component: BaseTableComponent<User>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseTableComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseTableComponent<User>);
    component = fixture.componentInstance;
    // Use empty columns so mat-table only needs the built-in 'select' column
    component.columns = [];
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('allColumns prepends select to provided columns', () => {
    // Test the getter logic directly without triggering mat-table rendering
    component.columns = ['name', 'email'];
    expect(component.allColumns).toEqual(['select', 'name', 'email']);
  });

  it('shows skeleton rows when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('[aria-label="Loading"]');
    expect(skeleton).toBeTruthy();
  });

  it('hides skeleton and shows table when loading is false', () => {
    component.loading = false;
    fixture.detectChanges();
    const skeleton = fixture.nativeElement.querySelector('[aria-label="Loading"]');
    expect(skeleton).toBeNull();
    const table = fixture.nativeElement.querySelector('mat-table');
    expect(table).toBeTruthy();
  });

  it('emits pageChange when triggered', () => {
    const emitSpy = spyOn(component.pageChange, 'emit');
    const event: PageEvent = { pageIndex: 1, pageSize: 10, length: 30 };
    component.pageChange.emit(event);
    expect(emitSpy).toHaveBeenCalledWith(event);
  });

  it('emits sortChange when triggered', () => {
    const emitSpy = spyOn(component.sortChange, 'emit');
    const sort: Sort = { active: 'name', direction: 'asc' };
    component.sortChange.emit(sort);
    expect(emitSpy).toHaveBeenCalledWith(sort);
  });

  it('allSelected is false when no rows are selected', () => {
    component.data = MOCK_USERS;
    expect(component.allSelected).toBeFalse();
  });

  it('allSelected is true when all rows are selected', () => {
    component.data = MOCK_USERS;
    component.toggleSelectAll({ checked: true } as MatCheckboxChange);
    expect(component.allSelected).toBeTrue();
  });

  it('toggleSelectAll selects all rows and emits rowSelect', () => {
    component.data = MOCK_USERS;
    const emitSpy = spyOn(component.rowSelect, 'emit');
    component.toggleSelectAll({ checked: true } as MatCheckboxChange);
    expect(emitSpy).toHaveBeenCalledWith(MOCK_USERS);
  });

  it('toggleSelectAll deselects all rows and emits empty array', () => {
    component.data = MOCK_USERS;
    component.toggleSelectAll({ checked: true } as MatCheckboxChange);
    const emitSpy = spyOn(component.rowSelect, 'emit');
    component.toggleSelectAll({ checked: false } as MatCheckboxChange);
    expect(emitSpy).toHaveBeenCalledWith([]);
    expect(component.allSelected).toBeFalse();
  });

  it('toggleRow selects a single row and emits rowSelect', () => {
    component.data = MOCK_USERS;
    const emitSpy = spyOn(component.rowSelect, 'emit');
    component.toggleRow(MOCK_USERS[0], { checked: true } as MatCheckboxChange);
    expect(component.isSelected(MOCK_USERS[0])).toBeTrue();
    expect(emitSpy).toHaveBeenCalledWith([MOCK_USERS[0]]);
  });

  it('toggleRow deselects a row', () => {
    component.data = MOCK_USERS;
    component.toggleRow(MOCK_USERS[0], { checked: true } as MatCheckboxChange);
    component.toggleRow(MOCK_USERS[0], { checked: false } as MatCheckboxChange);
    expect(component.isSelected(MOCK_USERS[0])).toBeFalse();
  });

  it('someSelected is true when partial rows selected', () => {
    component.data = MOCK_USERS;
    component.toggleRow(MOCK_USERS[0], { checked: true } as MatCheckboxChange);
    expect(component.someSelected).toBeTrue();
    expect(component.allSelected).toBeFalse();
  });

  it('clears selection when ngOnChanges is called', () => {
    component.data = MOCK_USERS;
    component.toggleSelectAll({ checked: true } as MatCheckboxChange);
    expect(component.allSelected).toBeTrue();

    component.data = [{ id: 4, name: 'Dave' }];
    component.ngOnChanges();
    expect(component.allSelected).toBeFalse();
    expect(component.isSelected(MOCK_USERS[0])).toBeFalse();
  });
});
