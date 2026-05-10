import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonCardComponent } from './skeleton-card.component';
import { SkeletonTableRowComponent } from './skeleton-table-row.component';
import { SkeletonAvatarComponent } from './skeleton-avatar.component';

describe('SkeletonCardComponent', () => {
  let fixture: ComponentFixture<SkeletonCardComponent>;
  let component: SkeletonCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SkeletonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders 1 card by default', () => {
    const cards = fixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(cards.length).toBe(1);
  });

  it('renders correct count of cards', () => {
    fixture.componentRef.setInput('count', 3);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(cards.length).toBe(3);
  });

  it('contains title and body placeholder blocks', () => {
    const title = fixture.nativeElement.querySelector('.h-4.bg-muted');
    const body = fixture.nativeElement.querySelector('.h-20.bg-muted');
    expect(title).not.toBeNull();
    expect(body).not.toBeNull();
  });
});

describe('SkeletonTableRowComponent', () => {
  let fixture: ComponentFixture<SkeletonTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonTableRowComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SkeletonTableRowComponent);
    fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders 1 row by default', () => {
    const rows = fixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(rows.length).toBe(1);
  });

  it('renders correct count of rows', () => {
    fixture.componentRef.setInput('count', 5);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(rows.length).toBe(5);
  });

  it('contains an avatar circle placeholder', () => {
    const circle = fixture.nativeElement.querySelector('.rounded-full.bg-muted');
    expect(circle).not.toBeNull();
  });
});

describe('SkeletonAvatarComponent', () => {
  let fixture: ComponentFixture<SkeletonAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonAvatarComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SkeletonAvatarComponent);
    fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders 1 avatar placeholder by default', () => {
    const items = fixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(items.length).toBe(1);
  });

  it('renders correct count of avatar placeholders', () => {
    fixture.componentRef.setInput('count', 4);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(items.length).toBe(4);
  });

  it('contains a circle and two text bars', () => {
    const circle = fixture.nativeElement.querySelector('.rounded-full.bg-muted');
    const bars = fixture.nativeElement.querySelectorAll('.bg-muted:not(.rounded-full)');
    expect(circle).not.toBeNull();
    expect(bars.length).toBeGreaterThanOrEqual(2);
  });
});
