import { FormSize } from '../types/form-size.type';

export const FORM_SIZE_CLASSES: Record<FormSize, string> = {
  sm: 'input-sm',
  md: 'input-md',
  lg: 'input-lg',
};

export const TEXTAREA_SIZE_CLASSES: Record<FormSize, string> = {
  sm: 'textarea-sm',
  md: 'textarea-md',
  lg: 'textarea-lg',
};

export const SELECT_SIZE_CLASSES: Record<FormSize, string> = {
  sm: 'select-sm',
  md: 'select-md',
  lg: 'select-lg',
};

export function getSizeClasses(size: FormSize): string {
  return FORM_SIZE_CLASSES[size];
}

export function getTextareaSizeClasses(size: FormSize): string {
  return TEXTAREA_SIZE_CLASSES[size];
}

export function getSelectSizeClasses(size: FormSize): string {
  return SELECT_SIZE_CLASSES[size];
}
