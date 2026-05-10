import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { FormSelectComponent } from './select.component';
import { Option } from '../types/form-option.type';

@Component({
  standalone: true,
  imports: [FormSelectComponent, ReactiveFormsModule],
  template: `
    <app-form-select
      [formControl]="ctrl"
      [options]="options"
      [placeholder]="placeholder" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl<string | null>(null);
  options: Option[] | import('rxjs').Observable<Option[]> = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ];
  placeholder = 'Pick a fruit';
}

describe('FormSelectComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let selectComponent: FormSelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
    selectComponent = hostFixture.debugElement
      .query(By.directive(FormSelectComponent))
      .componentInstance;
  });

  function getSelect(): HTMLSelectElement {
    return hostFixture.debugElement.query(By.css('select')).nativeElement;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render a native select element', () => {
    expect(getSelect()).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should reflect the control value in the select', () => {
      host.ctrl.setValue('banana');
      hostFixture.detectChanges();
      expect(host.ctrl.value).toBe('banana');
    });

    it('should disable the select when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(getSelect().disabled).toBeTrue();
    });

    it('should re-enable when the form control is re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(getSelect().disabled).toBeFalse();
    });

    it('should mark as touched on blur', () => {
      expect(host.ctrl.touched).toBeFalse();
      getSelect().dispatchEvent(new Event('blur'));
      expect(host.ctrl.touched).toBeTrue();
    });
  });

  describe('static options', () => {
    it('should resolve 3 options from a static array', () => {
      const resolved = (selectComponent as unknown as { resolvedOptions: () => Option[] }).resolvedOptions();
      expect(resolved.length).toBe(3);
      expect(resolved[0].value).toBe('apple');
    });
  });

  describe('Observable options', () => {
    it('should update resolved options when Observable emits', () => {
      const obs$ = new Subject<Option[]>();
      host.options = obs$;
      hostFixture.detectChanges();
      obs$.next([
        { label: 'Dog', value: 'dog' },
        { label: 'Cat', value: 'cat' },
      ]);
      hostFixture.detectChanges();
      const resolved = (selectComponent as unknown as { resolvedOptions: () => Option[] }).resolvedOptions();
      expect(resolved.length).toBe(2);
      expect(resolved[0].value).toBe('dog');
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

    it('should apply select-error when invalid and touched', () => {
      host.ctrl.markAsTouched();
      hostFixture.detectChanges();
      expect(getSelect().classList).toContain('select-error');
    });

    it('should not apply select-error when invalid but untouched', () => {
      expect(getSelect().classList).not.toContain('select-error');
    });
  });
});
