import { Input, inject } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

/**
 * Abstract base class for all form field components.
 * Provides ControlValueAccessor wiring, label/hint/placeholder inputs,
 * and a unified getErrorMessage() helper using Angular Material validators.
 *
 * Subclasses must apply their own @Component decorator with a template
 * that includes mat-form-field, mat-label, mat-hint, and mat-error.
 */
export abstract class BaseFormFieldComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() hint = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() readonly = false;
  @Input() errorMessages: Record<string, string> = {};

  readonly ngControl: NgControl | null;

  private readonly defaultErrors: Record<string, string> = {
    required: 'This field is required.',
    email: 'Enter a valid email address.',
    minlength: 'Value is too short.',
    maxlength: 'Value is too long.',
    pattern: 'Invalid format.',
  };

  constructor() {
    // Set valueAccessor in constructor to avoid circular dependency with NG_VALUE_ACCESSOR
    const ngControl = inject(NgControl, { optional: true, self: true });
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
    this.ngControl = ngControl;
  }

  getErrorMessage(): string | null {
    const errors = this.ngControl?.control?.errors;
    if (!errors) return null;

    const merged = { ...this.defaultErrors, ...this.errorMessages };
    const firstKey = Object.keys(errors)[0];
    return merged[firstKey] ?? `Invalid value (${firstKey}).`;
  }

  // ControlValueAccessor — subclasses override as needed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeValue(_value: unknown): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerOnChange(_fn: (value: unknown) => void): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerOnTouched(_fn: () => void): void {}
  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  protected _disabled = false;
}
