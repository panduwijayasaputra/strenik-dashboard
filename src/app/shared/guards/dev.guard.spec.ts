import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { canActivateDev } from './dev.guard';
import { environment } from '../../../environments/environment';

describe('canActivateDev', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue('/404') } },
      ],
    });
    router = TestBed.inject(Router);
  });

  it('should return true when not production', () => {
    const orig = environment.production;
    (environment as { production: boolean }).production = false;
    const result = TestBed.runInInjectionContext(() => canActivateDev());
    expect(result).toBeTrue();
    (environment as { production: boolean }).production = orig;
  });

  it('should redirect to /404 when production', () => {
    const orig = environment.production;
    (environment as { production: boolean }).production = true;
    TestBed.runInInjectionContext(() => canActivateDev());
    expect(router.createUrlTree).toHaveBeenCalledWith(['/404']);
    (environment as { production: boolean }).production = orig;
  });
});
