import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let fixture: ComponentFixture<SpinnerComponent>;
  let component: SpinnerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders with role="status"', () => {
    const el = fixture.nativeElement.querySelector('[role="status"]');
    expect(el).not.toBeNull();
  });

  it('renders sr-only "Loading" text', () => {
    const sr = fixture.nativeElement.querySelector('.sr-only');
    expect(sr).not.toBeNull();
    expect(sr.textContent.trim()).toBe('Loading');
  });

  it('applies sm size class', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner.className).toContain('w-4');
    expect(spinner.className).toContain('h-4');
  });

  it('applies md size class by default', () => {
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner.className).toContain('w-6');
    expect(spinner.className).toContain('h-6');
  });

  it('applies lg size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner.className).toContain('w-10');
    expect(spinner.className).toContain('h-10');
  });

  it('applies primary color class by default', () => {
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner.className).toContain('border-primary');
  });

  it('applies white color class', () => {
    fixture.componentRef.setInput('color', 'white');
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner.className).toContain('border-white');
  });

  it('applies muted color class', () => {
    fixture.componentRef.setInput('color', 'muted');
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner.className).toContain('border-muted-foreground');
  });
});
