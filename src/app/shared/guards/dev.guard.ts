import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export function canActivateDev(): true | ReturnType<Router['createUrlTree']> {
  if (!environment.production) return true;
  return inject(Router).createUrlTree(['/404']);
}
