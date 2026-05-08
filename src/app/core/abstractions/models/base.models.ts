import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

export type { Sort, PageEvent };

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export type BaseQueryParams = Record<string, string | number | boolean | undefined>;
