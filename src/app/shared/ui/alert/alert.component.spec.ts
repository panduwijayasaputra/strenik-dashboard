import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>;
  let component: AlertComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
  });

  it('renders the message', () => {
    component.message = 'Something went wrong';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Something went wrong');
  });

  it('renders the title when provided', () => {
    component.title = 'Error';
    component.message = 'Details here';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Error');
  });

  it('applies success container class for type success', () => {
    component.type = 'success';
    component.message = 'OK';
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelector('[role="alert"]');
    expect(div.className).toContain('bg-success/10');
  });

  it('applies error container class for type error', () => {
    component.type = 'error';
    component.message = 'Fail';
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelector('[role="alert"]');
    expect(div.className).toContain('bg-danger/10');
  });

  it('does not render close button when dismissible is false', () => {
    component.message = 'Hello';
    component.dismissible = false;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeNull();
  });

  it('renders close button when dismissible is true', () => {
    component.message = 'Hello';
    component.dismissible = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).not.toBeNull();
  });

  it('emits dismissed and hides when close button clicked', () => {
    component.message = 'Hello';
    component.dismissible = true;
    fixture.detectChanges();

    let emitted = false;
    component.dismissed.subscribe(() => (emitted = true));

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    fixture.detectChanges();

    expect(emitted).toBeTrue();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });
});
