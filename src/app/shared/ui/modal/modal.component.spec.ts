import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { ModalComponent } from './modal.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let component: ModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent, NoopAnimationsModule],
      providers: [
        importProvidersFrom(MatDialogModule, LucideAngularModule.pick({ X })),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('renders the title', () => {
    fixture.componentRef.setInput('title', 'Confirm Delete');
    fixture.detectChanges();
    const h2 = fixture.nativeElement.querySelector('h2');
    expect(h2.textContent.trim()).toBe('Confirm Delete');
  });

  it('has role="dialog"', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(el).not.toBeNull();
  });

  it('aria-labelledby points to title element id', () => {
    fixture.componentRef.setInput('title', 'My Modal');
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    const titleId = dialog.getAttribute('aria-labelledby');
    const h2 = fixture.nativeElement.querySelector(`#${titleId}`);
    expect(h2).not.toBeNull();
    expect(h2.textContent.trim()).toBe('My Modal');
  });

  it('emits closed when close button is clicked', () => {
    fixture.detectChanges();
    let emitted = false;
    component.closed.subscribe(() => (emitted = true));
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[aria-label="Close modal"]');
    btn.click();
    expect(emitted).toBeTrue();
  });

  it('applies sm size class', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog.className).toContain('max-w-[400px]');
  });

  it('applies xl size class', () => {
    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog.className).toContain('max-w-[960px]');
  });
});
