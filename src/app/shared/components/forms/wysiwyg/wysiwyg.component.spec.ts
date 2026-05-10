import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { WysiwygComponent } from './wysiwyg.component';

@Component({
  standalone: true,
  imports: [WysiwygComponent, ReactiveFormsModule],
  template: `<app-wysiwyg [formControl]="ctrl" />`,
})
class TestHostComponent {
  ctrl = new FormControl<string>('');
}

describe('WysiwygComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let wysiwyg: WysiwygComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
    wysiwyg = hostFixture.debugElement
      .query(By.directive(WysiwygComponent))
      .componentInstance;
  });

  afterEach(() => {
    // Destroy editor to avoid leaks between tests
    (wysiwyg as unknown as { editor: { destroy: () => void } | null }).editor?.destroy();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render the wysiwyg container', () => {
    const container = hostFixture.debugElement.query(By.css('[data-testid="wysiwyg-container"]'));
    expect(container).toBeTruthy();
  });

  it('should render toolbar buttons', () => {
    const buttons = hostFixture.debugElement.queryAll(By.css('[data-testid="wysiwyg-container"] button'));
    expect(buttons.length).toBeGreaterThan(0);
  });

  describe('ControlValueAccessor', () => {
    it('should not call onChange when writeValue is called', () => {
      const onChangeSpy = jasmine.createSpy('onChange');
      wysiwyg.registerOnChange(onChangeSpy);
      wysiwyg.writeValue('<p>hello</p>');
      hostFixture.detectChanges();
      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    it('should call onChange when onEditorUpdate is triggered', () => {
      const onChangeSpy = jasmine.createSpy('onChange');
      wysiwyg.registerOnChange(onChangeSpy);
      (wysiwyg as unknown as { onEditorUpdate: (html: string) => void })
        .onEditorUpdate('<p>new content</p>');
      expect(onChangeSpy).toHaveBeenCalledWith('<p>new content</p>');
    });

    it('should disable the editor when setDisabledState(true)', () => {
      wysiwyg.setDisabledState(true);
      expect((wysiwyg as unknown as { isDisabled: () => boolean }).isDisabled()).toBeTrue();
    });

    it('should enable the editor when setDisabledState(false)', () => {
      wysiwyg.setDisabledState(true);
      wysiwyg.setDisabledState(false);
      expect((wysiwyg as unknown as { isDisabled: () => boolean }).isDisabled()).toBeFalse();
    });

    it('should mark form control as touched when onTouched is called', () => {
      expect(host.ctrl.touched).toBeFalse();
      (wysiwyg as unknown as { onTouched: () => void }).onTouched();
      expect(host.ctrl.touched).toBeTrue();
    });

    it('should disable the form control when setDisabledState(true)', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(host.ctrl.disabled).toBeTrue();
    });

    it('should re-enable when form control is re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(host.ctrl.disabled).toBeFalse();
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

    it('should apply border-error when invalid and touched', () => {
      host.ctrl.markAsTouched();
      hostFixture.detectChanges();
      const container = hostFixture.debugElement.query(By.css('[data-testid="wysiwyg-container"]'));
      expect(container.nativeElement.classList).toContain('border-error');
    });

    it('should not apply border-error when invalid but untouched', () => {
      const container = hostFixture.debugElement.query(By.css('[data-testid="wysiwyg-container"]'));
      expect(container.nativeElement.classList).not.toContain('border-error');
    });
  });
});
