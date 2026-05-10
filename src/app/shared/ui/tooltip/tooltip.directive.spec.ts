import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltip } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipDirective } from './tooltip.directive';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [TooltipDirective],
  template: `<button appTooltip="Hello" tooltipPosition="below">Hover me</button>`,
})
class TestHostComponent {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('applies MatTooltip to the host element', () => {
    const tooltip = fixture.debugElement
      .query(By.css('button'))
      .injector.get(MatTooltip);
    expect(tooltip).toBeTruthy();
  });

  it('passes tooltip text to MatTooltip', () => {
    const tooltip = fixture.debugElement
      .query(By.css('button'))
      .injector.get(MatTooltip);
    expect(tooltip.message).toBe('Hello');
  });

  it('passes tooltipPosition to MatTooltip', () => {
    const tooltip = fixture.debugElement
      .query(By.css('button'))
      .injector.get(MatTooltip);
    expect(tooltip.position).toBe('below');
  });
});
