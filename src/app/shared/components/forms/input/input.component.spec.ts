import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular';
import { FormInputComponent } from './input.component';

@Component({
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule],
  template: `<app-form-input [formControl]="ctrl" [type]="type" [size]="size" [placeholder]="placeholder" />`,
})
class TestHostComponent {
  ctrl = new FormControl('');
  type: 'text' | 'email' | 'password' | 'number' = 'text';
  size: 'sm' | 'md' | 'lg' = 'md';
  placeholder = '';
}

describe('FormInputComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        LucideAngularModule.pick({ Eye, EyeOff }),
      ],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  function getInput(): HTMLInputElement {
    return hostFixture.debugElement.query(By.css('input')).nativeElement;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should display the initial form control value', () => {
      host.ctrl.setValue('initial');
      hostFixture.detectChanges();
      expect(getInput().value).toBe('initial');
    });

    it('should update the form control when the user types', () => {
      const input = getInput();
      input.value = 'typed';
      input.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      expect(host.ctrl.value).toBe('typed');
    });

    it('should mark the control as touched when the input is blurred', () => {
      expect(host.ctrl.touched).toBeFalse();
      getInput().dispatchEvent(new Event('blur'));
      expect(host.ctrl.touched).toBeTrue();
    });

    it('should disable the native input when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(getInput().disabled).toBeTrue();
    });

    it('should re-enable the native input when the form control is re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(getInput().disabled).toBeFalse();
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

    it('should not apply border-danger when valid and touched', () => {
      host.ctrl.setValue('value');
      host.ctrl.markAsTouched();
      hostFixture.detectChanges();
      expect(getInput().classList).not.toContain('border-danger');
    });
  });

  describe('size variants', () => {
    it('should apply sm size classes', () => {
      host.size = 'sm';
      hostFixture.detectChanges();
      expect(getInput().className).toContain('py-1');
      expect(getInput().className).toContain('px-2');
    });

    it('should apply md size classes by default', () => {
      expect(getInput().className).toContain('py-2');
      expect(getInput().className).toContain('px-3');
    });

    it('should apply lg size classes', () => {
      host.size = 'lg';
      hostFixture.detectChanges();
      expect(getInput().className).toContain('py-3');
      expect(getInput().className).toContain('px-4');
    });
  });

  describe('password toggle', () => {
    beforeEach(() => {
      host.type = 'password';
      hostFixture.detectChanges();
    });

    it('should render a password input', () => {
      expect(getInput().type).toBe('password');
    });

    it('should show a toggle button for password type', () => {
      const btn = hostFixture.debugElement.query(
        By.css('button[aria-label="Toggle password visibility"]'),
      );
      expect(btn).toBeTruthy();
    });

    it('should switch to text type when toggle is clicked', () => {
      hostFixture.debugElement
        .query(By.css('button[aria-label="Toggle password visibility"]'))
        .nativeElement.click();
      hostFixture.detectChanges();
      expect(getInput().type).toBe('text');
    });

    it('should switch back to password on second click', () => {
      const btn = hostFixture.debugElement.query(
        By.css('button[aria-label="Toggle password visibility"]'),
      ).nativeElement;
      btn.click();
      btn.click();
      hostFixture.detectChanges();
      expect(getInput().type).toBe('password');
    });

    it('should not render the toggle button for text type', () => {
      host.type = 'text';
      hostFixture.detectChanges();
      const btn = hostFixture.debugElement.query(
        By.css('button[aria-label="Toggle password visibility"]'),
      );
      expect(btn).toBeNull();
    });
  });
});
