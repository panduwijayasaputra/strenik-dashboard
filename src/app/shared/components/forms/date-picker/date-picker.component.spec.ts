import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Calendar, LucideAngularModule } from 'lucide-angular';
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
  ctrl = new FormControl<Date | null>(null);
  min: Date | null = null;
  max: Date | null = null;
  placeholder = 'Pick a date';
}

describe('FormDatePickerComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, LucideAngularModule.pick({ Calendar })],
      providers: [provideAnimations()],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  function getInput(): HTMLInputElement {
    return hostFixture.debugElement.query(By.css('input[matDatepickerInput]')).nativeElement;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render a matDatepickerInput', () => {
    expect(getInput()).toBeTruthy();
  });

  it('should render a calendar toggle button', () => {
    const toggle = hostFixture.debugElement.query(By.css('mat-datepicker-toggle'));
    expect(toggle).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should reflect a Date value in the control', () => {
      const date = new Date(2024, 0, 15);
      host.ctrl.setValue(date);
      hostFixture.detectChanges();
      expect(host.ctrl.value).toEqual(date);
    });

    it('should disable the input when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(host.ctrl.disabled).toBeTrue();
    });

    it('should re-enable when re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(host.ctrl.disabled).toBeFalse();
    });

    it('should mark as touched on blur', () => {
      expect(host.ctrl.touched).toBeFalse();
      getInput().dispatchEvent(new Event('blur'));
      expect(host.ctrl.touched).toBeTrue();
    });
  });

  describe('min and max constraints', () => {
    it('should pass min date to the datepicker input', () => {
      const min = new Date(2024, 0, 1);
      host.min = min;
      hostFixture.detectChanges();
      expect(getInput().getAttribute('min') ?? '').toBeDefined();
    });

    it('should pass max date to the datepicker input', () => {
      const max = new Date(2024, 11, 31);
      host.max = max;
      hostFixture.detectChanges();
      expect(getInput().getAttribute('max') ?? '').toBeDefined();
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

    it('should apply border-danger when invalid and touched', () => {
      host.ctrl.markAsTouched();
      hostFixture.detectChanges();
      expect(getInput().classList).toContain('border-danger');
    });

    it('should not apply border-danger when invalid but untouched', () => {
      expect(getInput().classList).not.toContain('border-danger');
    });
  });
});
