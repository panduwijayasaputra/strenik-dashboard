import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PopoverComponent } from './popover.component';
import { PopoverTriggerDirective } from './popover-trigger.directive';

@Component({
  standalone: true,
  imports: [PopoverTriggerDirective, PopoverComponent],
  template: `
    <button [popoverTrigger]="tpl">Open</button>
    <ng-template #tpl>
      <app-popover>Hello popover</app-popover>
    </ng-template>
  `,
})
class TestHostComponent {}

describe('PopoverComponent', () => {
  let fixture: ComponentFixture<PopoverComponent>;
  let component: PopoverComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverComponent, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(PopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders a styled container', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(el).not.toBeNull();
    expect(el.className).toContain('bg-card');
    expect(el.className).toContain('rounded-lg');
    expect(el.className).toContain('shadow-lg');
  });
});

describe('PopoverTriggerDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, PopoverComponent, NoopAnimationsModule],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerEl = overlayContainer.getContainerElement();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('opens popover template on click', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    fixture.detectChanges();
    expect(overlayContainerEl.textContent).toContain('Hello popover');
  });

  it('closes popover on second click', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    fixture.detectChanges();
    btn.click();
    fixture.detectChanges();
    expect(overlayContainerEl.textContent).not.toContain('Hello popover');
  });

  it('closes popover on Escape key', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    fixture.detectChanges();
    overlayContainerEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(overlayContainerEl.textContent).not.toContain('Hello popover');
  });
});
