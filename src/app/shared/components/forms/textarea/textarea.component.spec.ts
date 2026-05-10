import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormTextareaComponent } from './textarea.component';

@Component({
  standalone: true,
  imports: [FormTextareaComponent, ReactiveFormsModule],
  template: `
    <app-form-textarea
      [formControl]="ctrl"
      [rows]="rows"
      [size]="size"
      [placeholder]="placeholder"
      [autoResize]="autoResize" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl('');
  rows = 3;
  size: 'sm' | 'md' | 'lg' = 'md';
  placeholder = '';
  autoResize = false;
}

describe('FormTextareaComponent', () => {
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

  function getTextarea(): HTMLTextAreaElement {
    return hostFixture.debugElement.query(By.css('textarea')).nativeElement;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should display the initial form control value', () => {
      host.ctrl.setValue('initial text');
      hostFixture.detectChanges();
      expect(getTextarea().value).toBe('initial text');
    });

    it('should update the form control when the user types', () => {
      const ta = getTextarea();
      ta.value = 'typed text';
      ta.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      expect(host.ctrl.value).toBe('typed text');
    });

    it('should mark the control as touched on blur', () => {
      expect(host.ctrl.touched).toBeFalse();
      getTextarea().dispatchEvent(new Event('blur'));
      expect(host.ctrl.touched).toBeTrue();
    });

    it('should disable the native textarea when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(getTextarea().disabled).toBeTrue();
    });

    it('should re-enable the textarea when the form control is re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(getTextarea().disabled).toBeFalse();
    });
  });

  describe('rows input', () => {
    it('should apply the default rows of 3', () => {
      expect(getTextarea().rows).toBe(3);
    });

    it('should apply a custom rows value', () => {
      host.rows = 6;
      hostFixture.detectChanges();
      expect(getTextarea().rows).toBe(6);
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

    it('should apply textarea-error when invalid and touched', () => {
      host.ctrl.markAsTouched();
      hostFixture.detectChanges();
      expect(getTextarea().classList).toContain('textarea-error');
    });

    it('should not apply textarea-error when invalid but untouched', () => {
      expect(getTextarea().classList).not.toContain('textarea-error');
    });

    it('should not apply textarea-error when valid and touched', () => {
      host.ctrl.setValue('some value');
      host.ctrl.markAsTouched();
      hostFixture.detectChanges();
      expect(getTextarea().classList).not.toContain('textarea-error');
    });
  });

  describe('size variants', () => {
    it('should apply textarea-sm for sm size', () => {
      host.size = 'sm';
      hostFixture.detectChanges();
      expect(getTextarea().className).toContain('textarea-sm');
    });

    it('should apply textarea-md by default', () => {
      expect(getTextarea().className).toContain('textarea-md');
    });

    it('should apply textarea-lg for lg size', () => {
      host.size = 'lg';
      hostFixture.detectChanges();
      expect(getTextarea().className).toContain('textarea-lg');
    });
  });

  describe('autoResize', () => {
    it('should not set inline height when autoResize is false', () => {
      const ta = getTextarea();
      ta.value = 'line1\nline2\nline3';
      ta.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      expect(ta.style.height).toBe('');
    });

    it('should set inline height when autoResize is true and content changes', () => {
      host.autoResize = true;
      hostFixture.detectChanges();
      const ta = getTextarea();
      ta.value = 'line1\nline2\nline3';
      ta.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      expect(ta.style.height).not.toBe('');
    });
  });
});
