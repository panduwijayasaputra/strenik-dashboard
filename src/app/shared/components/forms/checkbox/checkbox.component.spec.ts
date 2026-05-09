import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormCheckboxComponent } from './checkbox.component';

@Component({
  standalone: true,
  imports: [FormCheckboxComponent, ReactiveFormsModule],
  template: `
    <app-form-checkbox
      [formControl]="ctrl"
      [label]="label"
      [indeterminate]="indeterminate" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl(false);
  label = 'Accept terms';
  indeterminate = false;
}

describe('FormCheckboxComponent', () => {
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

  function getCheckbox(): HTMLInputElement {
    return hostFixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render the label text', () => {
    const label = hostFixture.debugElement.query(By.css('label')).nativeElement as HTMLElement;
    expect(label.textContent).toContain('Accept terms');
  });

  describe('ControlValueAccessor', () => {
    it('should reflect true control value as checked', () => {
      host.ctrl.setValue(true);
      hostFixture.detectChanges();
      expect(getCheckbox().checked).toBeTrue();
    });

    it('should reflect false control value as unchecked', () => {
      host.ctrl.setValue(false);
      hostFixture.detectChanges();
      expect(getCheckbox().checked).toBeFalse();
    });

    it('should update the form control to true when checked', () => {
      const cb = getCheckbox();
      cb.checked = true;
      cb.dispatchEvent(new Event('change'));
      expect(host.ctrl.value).toBeTrue();
    });

    it('should update the form control to false when unchecked', () => {
      host.ctrl.setValue(true);
      hostFixture.detectChanges();
      const cb = getCheckbox();
      cb.checked = false;
      cb.dispatchEvent(new Event('change'));
      expect(host.ctrl.value).toBeFalse();
    });

    it('should mark the control as touched on blur', () => {
      expect(host.ctrl.touched).toBeFalse();
      getCheckbox().dispatchEvent(new Event('blur'));
      expect(host.ctrl.touched).toBeTrue();
    });

    it('should disable the checkbox when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(getCheckbox().disabled).toBeTrue();
    });

    it('should re-enable the checkbox when the form control is re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(getCheckbox().disabled).toBeFalse();
    });
  });

  describe('indeterminate', () => {
    it('should set the indeterminate property on the native input when true', () => {
      host.indeterminate = true;
      hostFixture.detectChanges();
      expect(getCheckbox().indeterminate).toBeTrue();
    });

    it('should not set indeterminate when false', () => {
      host.indeterminate = false;
      hostFixture.detectChanges();
      expect(getCheckbox().indeterminate).toBeFalse();
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      host.ctrl.setValidators(Validators.requiredTrue);
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
      expect(getCheckbox().classList).toContain('border-danger');
    });

    it('should not apply border-danger when invalid but untouched', () => {
      expect(getCheckbox().classList).not.toContain('border-danger');
    });
  });
});
