import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatStatus', standalone: true })
export class FormatStatusPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '-';
    return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
