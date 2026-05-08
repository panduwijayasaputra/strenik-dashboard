import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LucideAngularModule, X } from 'lucide-angular';
import { BaseModalComponent } from './base-modal.component';

describe('BaseModalComponent', () => {
  let fixture: ComponentFixture<BaseModalComponent>;
  let component: BaseModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BaseModalComponent,
        NoopAnimationsModule,
        LucideAngularModule.pick({ X }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test Modal');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders when isOpen is true', () => {
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
  });

  it('does not render when isOpen is false', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeNull();
  });

  it('renders the title in the header', () => {
    expect(fixture.nativeElement.textContent).toContain('Test Modal');
  });

  it('X button emits closed', () => {
    const closedSpy = spyOn(component.closed, 'emit');
    const closeBtn = fixture.nativeElement.querySelector('button[aria-label="Close"]');
    closeBtn.click();
    expect(closedSpy).toHaveBeenCalled();
  });

  it('backdrop click emits closed', () => {
    const closedSpy = spyOn(component.closed, 'emit');
    const backdrop = fixture.nativeElement.querySelector('.fixed.inset-0.z-40');
    backdrop.click();
    expect(closedSpy).toHaveBeenCalled();
  });

  it('ESC key emits closed', () => {
    const closedSpy = spyOn(component.closed, 'emit');
    component.onEscape();
    expect(closedSpy).toHaveBeenCalled();
  });

  it('ESC key does not emit closed when isOpen is false', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    const closedSpy = spyOn(component.closed, 'emit');
    component.onEscape();
    expect(closedSpy).not.toHaveBeenCalled();
  });

  it('applies pointer-events-none and opacity-50 to footer when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('.border-t.border-border');
    expect(footer.classList).toContain('pointer-events-none');
    expect(footer.classList).toContain('opacity-50');
  });

  it('does not apply loading classes to footer when loading is false', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('.border-t.border-border');
    expect(footer.classList).not.toContain('pointer-events-none');
    expect(footer.classList).not.toContain('opacity-50');
  });
});
