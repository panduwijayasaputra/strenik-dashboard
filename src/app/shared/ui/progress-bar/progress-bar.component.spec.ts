import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let fixture: ComponentFixture<ProgressBarComponent>;
  let component: ProgressBarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders role="progressbar"', () => {
    const el = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(el).not.toBeNull();
  });

  it('sets aria-valuenow from value input', () => {
    fixture.componentRef.setInput('value', 42);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(el.getAttribute('aria-valuenow')).toBe('42');
  });

  it('sets aria-valuemin and aria-valuemax', () => {
    const el = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
  });

  it('sets fill width based on value', () => {
    fixture.componentRef.setInput('value', 60);
    fixture.detectChanges();
    const fill: HTMLElement = fixture.nativeElement.querySelector('[role="progressbar"] div');
    expect(fill.style.width).toBe('60%');
  });

  it('clamps value below 0 to 0%', () => {
    fixture.componentRef.setInput('value', -10);
    fixture.detectChanges();
    const fill: HTMLElement = fixture.nativeElement.querySelector('[role="progressbar"] div');
    expect(fill.style.width).toBe('0%');
  });

  it('clamps value above 100 to 100%', () => {
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();
    const fill: HTMLElement = fixture.nativeElement.querySelector('[role="progressbar"] div');
    expect(fill.style.width).toBe('100%');
  });

  it('applies primary color class by default', () => {
    const fill: HTMLElement = fixture.nativeElement.querySelector('[role="progressbar"] div');
    expect(fill.className).toContain('bg-primary');
  });

  it('applies success color class', () => {
    fixture.componentRef.setInput('color', 'success');
    fixture.detectChanges();
    const fill: HTMLElement = fixture.nativeElement.querySelector('[role="progressbar"] div');
    expect(fill.className).toContain('bg-success');
  });

  it('does not show label by default', () => {
    const label = fixture.nativeElement.querySelector('span.tabular-nums');
    expect(label).toBeNull();
  });

  it('shows label when showLabel is true', () => {
    fixture.componentRef.setInput('value', 75);
    fixture.componentRef.setInput('showLabel', true);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('span.tabular-nums');
    expect(label).not.toBeNull();
    expect(label.textContent.trim()).toBe('75%');
  });
});
