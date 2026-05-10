import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { FormMultiSelectComponent } from './multi-select.component';
import { Option } from '../types/form-option.type';

@Component({
  standalone: true,
  imports: [FormMultiSelectComponent, ReactiveFormsModule],
  template: `
    <app-form-multi-select
      [formControl]="ctrl"
      [options]="options"
      [maxSelections]="maxSelections"
      [placeholder]="placeholder" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl<string[]>([]);
  options: Option[] | import('rxjs').Observable<Option[]> = [
    { label: 'Red', value: 'red' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue' },
  ];
  maxSelections: number | null = null;
  placeholder = 'Pick colours';
}

describe('FormMultiSelectComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let multiSelectComponent: FormMultiSelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
    multiSelectComponent = hostFixture.debugElement
      .query(By.directive(FormMultiSelectComponent))
      .componentInstance;
  });

  function getTrigger(): HTMLElement {
    return hostFixture.debugElement.query(By.css('[data-testid="multi-select-trigger"]')).nativeElement;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render the multi-select trigger element', () => {
    expect(getTrigger()).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should reflect an array of values in the control', () => {
      host.ctrl.setValue(['red', 'blue']);
      hostFixture.detectChanges();
      expect(host.ctrl.value).toEqual(['red', 'blue']);
    });

    it('should render chips for selected values', () => {
      host.ctrl.setValue(['red', 'blue']);
      hostFixture.detectChanges();
      const chips = hostFixture.debugElement.queryAll(By.css('[data-testid="selected-chip"]'));
      expect(chips.length).toBe(2);
    });

    it('should disable the trigger when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(host.ctrl.disabled).toBeTrue();
    });

    it('should re-enable when the form control is re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(host.ctrl.disabled).toBeFalse();
    });
  });

  describe('resolvedOptions', () => {
    it('should resolve options from a static array', () => {
      const resolved = (multiSelectComponent as unknown as { resolvedOptions: () => Option[] }).resolvedOptions();
      expect(resolved.length).toBe(3);
    });

    it('should update resolved options when Observable emits', () => {
      const obs$ = new Subject<Option[]>();
      host.options = obs$;
      hostFixture.detectChanges();
      obs$.next([{ label: 'Alpha', value: 'alpha' }]);
      hostFixture.detectChanges();
      const resolved = (multiSelectComponent as unknown as { resolvedOptions: () => Option[] }).resolvedOptions();
      expect(resolved.length).toBe(1);
      expect(resolved[0].value).toBe('alpha');
    });
  });

  describe('maxSelections', () => {
    it('should not restrict selections when maxSelections is null', () => {
      host.maxSelections = null;
      hostFixture.detectChanges();
      const isDisabled = (multiSelectComponent as unknown as { isOptionDisabled: (v: unknown) => boolean }).isOptionDisabled('green');
      expect(isDisabled).toBeFalse();
    });

    it('should disable unselected options when maxSelections is reached', () => {
      host.maxSelections = 2;
      host.ctrl.setValue(['red', 'blue']);
      hostFixture.detectChanges();
      const isDisabled = (multiSelectComponent as unknown as { isOptionDisabled: (v: unknown) => boolean }).isOptionDisabled('green');
      expect(isDisabled).toBeTrue();
    });

    it('should not disable options that are already selected when limit is reached', () => {
      host.maxSelections = 2;
      host.ctrl.setValue(['red', 'blue']);
      hostFixture.detectChanges();
      const isDisabled = (multiSelectComponent as unknown as { isOptionDisabled: (v: unknown) => boolean }).isOptionDisabled('red');
      expect(isDisabled).toBeFalse();
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
      expect(getTrigger().classList).toContain('select-error');
    });

    it('should not apply select-error when invalid but untouched', () => {
      expect(getTrigger().classList).not.toContain('select-error');
    });
  });
});
