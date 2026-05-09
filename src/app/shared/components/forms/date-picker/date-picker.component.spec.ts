import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormDatePickerComponent } from './date-picker.component';

@Component({
  standalone: true,
  imports: [FormDatePickerComponent, ReactiveFormsModule],
  template: `
    <app-form-date-picker
      [formControl]="ctrl"
      [min]="min"
      [max]="max"
      [placeholder]="placeholder" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl<string | null>(null);
  min: string | null = null;
  max: string | null = null;
  placeholder = 'Pick a date';
}

describe('FormDatePickerComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  function getInput(): HTMLInputElement {
    return hostFixture.debugElement.query(By.css('input[type="date"]')).nativeElement;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render a native date input', () => {
    expect(getInput()).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should reflect a string date value in the input', () => {
      host.ctrl.setValue('2024-01-15');
      hostFixture.detectChanges();
      expect(getInput().value).toBe('2024-01-15');
    });

    it('should update the form control when the user picks a date', () => {
      const input = getInput();
      input.value = '2024-06-01';
      input.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      expect(host.ctrl.value).toBe('2024-06-01');
    });

    it('should disable the input when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(getInput().disabled).toBeTrue();
    });

    it('should re-enable when re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(getInput().disabled).toBeFalse();
    });

    it('should mark as touched on blur', () => {
      expect(host.ctrl.touched).toBeFalse();
      getInput().dispatchEvent(new Event('blur'));
      expect(host.ctrl.touched).toBeTrue();
    });
  });

  describe('min and max constraints', () => {
    it('should pass min string to the date input', () => {
      host.min = '2024-01-01';
      hostFixture.detectChanges();
      expect(getInput().getAttribute('min')).toBe('2024-01-01');
    });

    it('should pass max string to the date input', () => {
      host.max = '2024-12-31';
      hostFixture.detectChanges();
      expect(getInput().getAttribute('max')).toBe('2024-12-31');
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
