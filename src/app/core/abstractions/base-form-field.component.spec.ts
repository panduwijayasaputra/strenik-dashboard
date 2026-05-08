import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BaseFormFieldComponent } from './base-form-field.component';
import { MatInputModule } from '@angular/material/input';

// Concrete subclass — no NG_VALUE_ACCESSOR needed (base constructor handles it)
@Component({
  selector: 'app-test-input',
  standalone: true,
  imports: [MatInputModule],
  template: `<input matInput [placeholder]="placeholder" [disabled]="_disabled" />`,
})
class TestInputComponent extends BaseFormFieldComponent {}

@Component({
  standalone: true,
  imports: [TestInputComponent, ReactiveFormsModule],
  template: `<app-test-input [formControl]="ctrl" label="Name" />`,
})
class HostWithRequiredComponent {
  ctrl = new FormControl('', Validators.required);
}

@Component({
  standalone: true,
  imports: [TestInputComponent, ReactiveFormsModule],
  template: `<app-test-input [formControl]="ctrl" label="Email" />`,
})
class HostWithEmailComponent {
  ctrl = new FormControl('', Validators.email);
}

describe('BaseFormFieldComponent', () => {
  describe('with required validator', () => {
    let hostFixture: ComponentFixture<HostWithRequiredComponent>;
    let component: TestInputComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HostWithRequiredComponent, NoopAnimationsModule],
      }).compileComponents();

      hostFixture = TestBed.createComponent(HostWithRequiredComponent);
      hostFixture.detectChanges();
      component = hostFixture.debugElement.children[0].componentInstance as TestInputComponent;
    });

    it('creates the component', () => {
      expect(component).toBeTruthy();
    });

    it('getErrorMessage() returns required message when control has required error', () => {
      component.ngControl!.control!.markAsTouched();
      component.ngControl!.control!.setValue('');
      hostFixture.detectChanges();
      expect(component.getErrorMessage()).toBe('This field is required.');
    });

    it('getErrorMessage() returns null when control is valid', () => {
      component.ngControl!.control!.setValue('Alice');
      hostFixture.detectChanges();
      expect(component.getErrorMessage()).toBeNull();
    });

    it('getErrorMessage() uses custom errorMessages override', () => {
      component.errorMessages = { required: 'Custom required message.' };
      component.ngControl!.control!.markAsTouched();
      component.ngControl!.control!.setValue('');
      hostFixture.detectChanges();
      expect(component.getErrorMessage()).toBe('Custom required message.');
    });

    it('setDisabledState sets _disabled to true', () => {
      component.setDisabledState(true);
      expect(component['_disabled']).toBeTrue();
    });

    it('setDisabledState sets _disabled to false', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(component['_disabled']).toBeFalse();
    });
  });

  describe('with email validator', () => {
    let hostFixture: ComponentFixture<HostWithEmailComponent>;
    let component: TestInputComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HostWithEmailComponent, NoopAnimationsModule],
      }).compileComponents();

      hostFixture = TestBed.createComponent(HostWithEmailComponent);
      hostFixture.detectChanges();
      component = hostFixture.debugElement.children[0].componentInstance as TestInputComponent;
    });

    it('getErrorMessage() returns email error message for invalid email', () => {
      component.ngControl!.control!.setValue('not-an-email');
      component.ngControl!.control!.markAsTouched();
      hostFixture.detectChanges();
      expect(component.getErrorMessage()).toBe('Enter a valid email address.');
    });
  });
});
