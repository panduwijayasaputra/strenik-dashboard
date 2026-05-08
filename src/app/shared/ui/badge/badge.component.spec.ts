import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BadgeComponent } from './badge.component';

@Component({
  standalone: true,
  imports: [BadgeComponent],
  template: `<app-badge [variant]="variant" [size]="size" [dot]="dot">Label</app-badge>`,
})
class TestHostComponent {
  variant = 'primary';
  size = 'md';
  dot = false;
}

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;
  let component: BadgeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders a span with primary variant classes by default', () => {
    const span = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-primary/10');
    expect(span.className).toContain('text-primary');
  });

  it('applies success variant classes', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-success/10');
    expect(span.className).toContain('text-success');
  });

  it('applies danger variant classes', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('bg-danger/10');
    expect(span.className).toContain('text-danger');
  });

  it('applies sm size class', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('px-1.5');
  });

  it('renders a circle element in dot mode instead of text span', () => {
    fixture.componentRef.setInput('dot', true);
    fixture.detectChanges();
    const circle = fixture.nativeElement.querySelector('span.rounded-full.w-2');
    expect(circle).not.toBeNull();
    const textSpan = fixture.nativeElement.querySelector('span.font-medium');
    expect(textSpan).toBeNull();
  });

  it('dot mode applies correct background color', () => {
    fixture.componentRef.setInput('dot', true);
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();
    const circle = fixture.nativeElement.querySelector('span.rounded-full');
    expect(circle.className).toContain('bg-success');
  });
});
