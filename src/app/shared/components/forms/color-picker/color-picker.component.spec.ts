import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormColorPickerComponent } from './color-picker.component';

@Component({
  standalone: true,
  imports: [FormColorPickerComponent, ReactiveFormsModule],
  template: `<app-form-color-picker [formControl]="ctrl" />`,
})
class TestHostComponent {
  ctrl = new FormControl<string>('#000000');
}

describe('FormColorPickerComponent', () => {
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

  function getColorInput(): HTMLInputElement {
    return hostFixture.debugElement.query(By.css('input[type="color"]')).nativeElement;
  }

  function getSwatch(): HTMLElement {
    return hostFixture.debugElement.query(By.css('[data-testid="color-swatch"]')).nativeElement;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render a native color input', () => {
    expect(getColorInput()).toBeTruthy();
  });

  it('should render a color swatch', () => {
    expect(getSwatch()).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should reflect the control value as the input value', () => {
      host.ctrl.setValue('#ff0000');
      hostFixture.detectChanges();
      expect(getColorInput().value).toBe('#ff0000');
    });

    it('should set the swatch background to the current color', () => {
      host.ctrl.setValue('#00ff00');
      hostFixture.detectChanges();
      expect(getSwatch().style.backgroundColor).not.toBe('');
    });

    it('should update the form control when the color input changes', () => {
      const input = getColorInput();
      input.value = '#0000ff';
      input.dispatchEvent(new Event('input'));
      expect(host.ctrl.value).toBe('#0000ff');
    });

    it('should mark as touched on blur', () => {
      expect(host.ctrl.touched).toBeFalse();
      getColorInput().dispatchEvent(new Event('blur'));
      expect(host.ctrl.touched).toBeTrue();
    });

    it('should disable the input when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(getColorInput().disabled).toBeTrue();
    });

    it('should re-enable the input when re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(getColorInput().disabled).toBeFalse();
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      host.ctrl.setValidators(Validators.required);
      host.ctrl.setValue('');
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
      expect(getColorInput().classList).toContain('border-danger');
    });

    it('should not apply border-danger when invalid but untouched', () => {
      expect(getColorInput().classList).not.toContain('border-danger');
    });
  });
});
