import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormTimePickerComponent } from './time-picker.component';

@Component({
  standalone: true,
  imports: [FormTimePickerComponent, ReactiveFormsModule],
  template: `
    <app-form-time-picker
      [formControl]="ctrl"
      [format]="format"
      [placeholder]="placeholder" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl<string | null>(null);
  format: 12 | 24 = 24;
  placeholder = 'Select time';
}

describe('FormTimePickerComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let timeComponent: FormTimePickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
    timeComponent = hostFixture.debugElement
      .query(By.directive(FormTimePickerComponent))
      .componentInstance;
  });

  function getInput(): HTMLInputElement {
    return hostFixture.debugElement.query(By.css('input[type="time"]')).nativeElement;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render a native time input', () => {
    expect(getInput()).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should display the HH:mm value when writeValue is called', () => {
      host.ctrl.setValue('14:30');
      hostFixture.detectChanges();
      expect(getInput().value).toBe('14:30');
    });

    it('should update the form control when the user picks a time', () => {
      const input = getInput();
      input.value = '09:15';
      input.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      expect(host.ctrl.value).toBe('09:15');
    });

    it('should disable the input when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(getInput().disabled).toBeTrue();
    });

    it('should re-enable the input when re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(getInput().disabled).toBeFalse();
    });

    it('should mark the control as touched on blur', () => {
      expect(host.ctrl.touched).toBeFalse();
      getInput().dispatchEvent(new Event('blur'));
      expect(host.ctrl.touched).toBeTrue();
    });
  });

  describe('format input', () => {
    it('should pass format=24 to the internal signal', () => {
      host.format = 24;
      hostFixture.detectChanges();
      const fmt = (timeComponent as unknown as { format: () => 12 | 24 }).format();
      expect(fmt).toBe(24);
    });

    it('should pass format=12 to the internal signal', () => {
      host.format = 12;
      hostFixture.detectChanges();
      const fmt = (timeComponent as unknown as { format: () => 12 | 24 }).format();
      expect(fmt).toBe(12);
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      host.ctrl.setValidators(Validators.required);
      host.ctrl.updateValueAndValidity();
      hostFixture.detectChanges();
    });

    afterEach(() => {
      host.ctrl.clearValidators();
      host.ctrl.markAsUntouched();
      host.ctrl.updateValueAndValidity();
    });

    it('should apply input-error when invalid and touched', () => {
      host.ctrl.markAsTouched();
      hostFixture.detectChanges();
      expect(getInput().classList).toContain('input-error');
    });

    it('should not apply input-error when invalid but untouched', () => {
      expect(getInput().classList).not.toContain('input-error');
    });
  });
});
