import { HttpInterceptorFn } from '@angular/common/http';
import { map } from 'rxjs';

export const apiResponseUnwrapperInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(map(event => event));
