import { AbstractControl, ValidationErrors } from '@angular/forms';

export function tokenLimitValidator(control: AbstractControl): ValidationErrors | null {
  const value = Number(control.value);
  if (isNaN(value) || value < 0) return { tokenLimit: 'Must be a non-negative number' };
  return null;
}
