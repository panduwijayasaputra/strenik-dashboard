import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ContentChange } from 'ngx-quill';
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
      providers: [provideAnimations()],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
    wysiwyg = hostFixture.debugElement
      .query(By.directive(WysiwygComponent))
      .componentInstance;
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should set internal htmlValue via writeValue', () => {
      wysiwyg.writeValue('<p>hello</p>');
      expect((wysiwyg as unknown as { htmlValue: () => string }).htmlValue()).toBe('<p>hello</p>');
    });

    it('should set htmlValue to empty string when writeValue receives null', () => {
      wysiwyg.writeValue(null);
      expect((wysiwyg as unknown as { htmlValue: () => string }).htmlValue()).toBe('');
    });

    it('should call onChange with HTML when editor content changes (user source)', () => {
      const onChangeSpy = jasmine.createSpy('onChange');
      wysiwyg.registerOnChange(onChangeSpy);
      (wysiwyg as unknown as { onContentChanged: (e: ContentChange) => void })
        .onContentChanged({ html: '<p>new</p>', source: 'user' } as ContentChange);
      expect(onChangeSpy).toHaveBeenCalledWith('<p>new</p>');
    });

    it('should not call onChange when content change source is api', () => {
      const onChangeSpy = jasmine.createSpy('onChange');
      wysiwyg.registerOnChange(onChangeSpy);
      (wysiwyg as unknown as { onContentChanged: (e: ContentChange) => void })
        .onContentChanged({ html: '<p>set by code</p>', source: 'api' } as ContentChange);
      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    it('should not call onChange when writeValue is called', () => {
      const onChangeSpy = jasmine.createSpy('onChange');
      wysiwyg.registerOnChange(onChangeSpy);
      wysiwyg.writeValue('<p>hello</p>');
      hostFixture.detectChanges();
      expect(onChangeSpy).not.toHaveBeenCalled();
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

    it('should mark form control as touched on editor blur', () => {
      expect(host.ctrl.touched).toBeFalse();
      (wysiwyg as unknown as { onTouched: () => void }).onTouched();
      expect(host.ctrl.touched).toBeTrue();
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
      const container = hostFixture.debugElement.query(
        By.css('[data-testid="wysiwyg-container"]'),
      );
      expect(container.nativeElement.classList).toContain('border-danger');
    });

    it('should not apply border-danger when invalid but untouched', () => {
      const container = hostFixture.debugElement.query(
        By.css('[data-testid="wysiwyg-container"]'),
      );
      expect(container.nativeElement.classList).not.toContain('border-danger');
    });
  });
});
