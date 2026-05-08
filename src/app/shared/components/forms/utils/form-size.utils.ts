import { FormSize } from '../types/form-size.type';

export const FORM_SIZE_CLASSES: Record<FormSize, string> = {
  sm: 'py-1 px-2 text-xs',
  md: 'py-2 px-3 text-sm',
  lg: 'py-3 px-4 text-base',
};

export function getSizeClasses(size: FormSize): string {
  return FORM_SIZE_CLASSES[size];
}
