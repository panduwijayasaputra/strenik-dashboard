import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { FormAutocompleteComponent } from './autocomplete.component';
import { Option } from '../types/form-option.type';

@Component({
  standalone: true,
  imports: [FormAutocompleteComponent, ReactiveFormsModule],
  template: `
    <app-form-autocomplete
      [formControl]="ctrl"
      [options]="options"
      [placeholder]="placeholder"
      (search)="lastSearch = $event" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl<unknown>(null);
  options: Option[] | import('rxjs').Observable<Option[]> = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
  ];
  placeholder = 'Search frameworks';
  lastSearch = '';
}

describe('FormAutocompleteComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let autoComponent: FormAutocompleteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
    autoComponent = hostFixture.debugElement
      .query(By.directive(FormAutocompleteComponent))
      .componentInstance;
  });

  function getInput(): HTMLInputElement {
    return hostFixture.debugElement.query(By.css('input')).nativeElement;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render a text input', () => {
    expect(getInput()).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should mark control as touched on blur', () => {
      expect(host.ctrl.touched).toBeFalse();
      getInput().dispatchEvent(new Event('blur'));
      expect(host.ctrl.touched).toBeTrue();
    });

    it('should disable the input when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(getInput().disabled).toBeTrue();
    });

    it('should re-enable the input when the form control is re-enabled', () => {
      host.ctrl.disable();
      host.ctrl.enable();
      hostFixture.detectChanges();
      expect(getInput().disabled).toBeFalse();
    });
  });

  describe('static option filtering', () => {
    it('should filter options client-side when typing', () => {
      const input = getInput();
      input.value = 'ang';
      input.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      const filtered = (autoComponent as unknown as { filteredOptions: () => Option[] }).filteredOptions();
      expect(filtered.length).toBe(1);
      expect(filtered[0].value).toBe('angular');
    });

    it('should show all options when input is empty', () => {
      const input = getInput();
      input.value = '';
      input.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      const filtered = (autoComponent as unknown as { filteredOptions: () => Option[] }).filteredOptions();
      expect(filtered.length).toBe(3);
    });

    it('should be case-insensitive when filtering', () => {
      const input = getInput();
      input.value = 'REACT';
      input.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      const filtered = (autoComponent as unknown as { filteredOptions: () => Option[] }).filteredOptions();
      expect(filtered.length).toBe(1);
      expect(filtered[0].value).toBe('react');
    });
  });

  describe('Observable options', () => {
    it('should emit search output on keyup when options is Observable', () => {
      const obs$ = new Subject<Option[]>();
      host.options = obs$;
      hostFixture.detectChanges();
      const input = getInput();
      input.value = 'ang';
      input.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      expect(host.lastSearch).toBe('ang');
    });

    it('should display options emitted by the Observable', () => {
      const obs$ = new Subject<Option[]>();
      host.options = obs$;
      hostFixture.detectChanges();
      obs$.next([{ label: 'Svelte', value: 'svelte' }]);
      hostFixture.detectChanges();
      const filtered = (autoComponent as unknown as { filteredOptions: () => Option[] }).filteredOptions();
      expect(filtered.length).toBe(1);
      expect(filtered[0].value).toBe('svelte');
    });
  });

  describe('option selection', () => {
    it('should write the option value (not label) to the form control on selection', () => {
      (autoComponent as unknown as { selectOption: (o: Option) => void })
        .selectOption({ label: 'Angular', value: 'angular' });
      expect(host.ctrl.value).toBe('angular');
    });

    it('should display the option label in the input after selection', () => {
      (autoComponent as unknown as { selectOption: (o: Option) => void })
        .selectOption({ label: 'Angular', value: 'angular' });
      hostFixture.detectChanges();
      expect(getInput().value).toBe('Angular');
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

    it('should apply input-error when invalid and touched', () => {
      host.ctrl.markAsTouched();
      hostFixture.detectChanges();
      expect(getInput().classList).toContain('input-error');
    });

    it('should not apply input-error when invalid but untouched', () => {
      expect(getInput().classList).not.toContain('input-error');
    });
  });
});
