import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDate', standalone: true })
export class FormatDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format: 'short' | 'long' = 'short'): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: format,
    }).format(new Date(value));
  }
}
