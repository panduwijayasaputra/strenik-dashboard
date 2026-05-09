import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormRadioGroupComponent } from './radio-group.component';

@Component({
  standalone: true,
  imports: [FormRadioGroupComponent, ReactiveFormsModule],
  template: `
    <app-form-radio-group
      [formControl]="ctrl"
      [options]="options"
      [orientation]="orientation" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl('');
  options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];
  orientation: 'horizontal' | 'vertical' = 'vertical';
}

describe('FormRadioGroupComponent', () => {
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

  function getRadios(): HTMLInputElement[] {
    return hostFixture.debugElement
      .queryAll(By.css('input[type="radio"]'))
      .map((d) => d.nativeElement);
  }

  function getContainer(): HTMLElement {
    return hostFixture.debugElement.query(By.css('[role="radiogroup"]')).nativeElement;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render one radio input per option', () => {
    expect(getRadios().length).toBe(3);
  });

  it('should render option labels', () => {
    const labels = hostFixture.debugElement
      .queryAll(By.css('label'))
      .map((d) => d.nativeElement.textContent.trim());
    expect(labels).toContain('Option A');
    expect(labels).toContain('Option B');
    expect(labels).toContain('Option C');
  });

  describe('ControlValueAccessor', () => {
    it('should pre-select the radio matching the control value', () => {
      host.ctrl.setValue('b');
      hostFixture.detectChanges();
      expect(getRadios()[1].checked).toBeTrue();
    });

    it('should update the form control when a radio is selected', () => {
      const radios = getRadios();
      radios[2].click();
      hostFixture.detectChanges();
      expect(host.ctrl.value).toBe('c');
    });

    it('should mark the control as touched when a radio is clicked', () => {
      expect(host.ctrl.touched).toBeFalse();
      getRadios()[0].dispatchEvent(new Event('blur'));
      expect(host.ctrl.touched).toBeTrue();
    });

    it('should disable all radios when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(getRadios().every((r) => r.disabled)).toBeTrue();
    });

    it('should re-enable all radios when the form control is re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(getRadios().every((r) => r.disabled)).toBeFalse();
    });
  });

  describe('orientation', () => {
    it('should apply flex-col for vertical orientation by default', () => {
      expect(getContainer().classList).toContain('flex-col');
    });

    it('should apply flex-row for horizontal orientation', () => {
      host.orientation = 'horizontal';
      hostFixture.detectChanges();
      expect(getContainer().classList).toContain('flex-row');
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      host.ctrl.setValidators(Validators.required);
      host.ctrl.setValue(null);
      host.ctrl.updateValueAndValidity();
      hostFixture.detectChanges();
    });

    afterEach(() => {
      host.ctrl.clearValidators();
      host.ctrl.markAsUntouched();
      host.ctrl.updateValueAndValidity();
    });

    it('should apply border-danger on the container when invalid and touched', () => {
      host.ctrl.markAsTouched();
      hostFixture.detectChanges();
      expect(getContainer().classList).toContain('border-danger');
    });

    it('should not apply border-danger when invalid but untouched', () => {
      expect(getContainer().classList).not.toContain('border-danger');
    });
  });
});
