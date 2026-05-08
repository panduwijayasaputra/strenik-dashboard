import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoggingService } from '../services/logging.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);
  logger.log(`HTTP ${req.method} ${req.url}`);
  return next(req).pipe(
    tap({ error: err => logger.error(`HTTP error ${req.url}`, err) })
  );
};
