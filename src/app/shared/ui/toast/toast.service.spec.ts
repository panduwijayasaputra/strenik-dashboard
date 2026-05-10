import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning', 'info']);

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });
    service = TestBed.inject(ToastService);
  });

  it('delegates success() to ToastrService', () => {
    service.success('Saved', 'OK');
    expect(toastrSpy.success).toHaveBeenCalledWith('Saved', 'OK');
  });

  it('delegates error() to ToastrService', () => {
    service.error('Failed');
    expect(toastrSpy.error).toHaveBeenCalledWith('Failed', undefined);
  });

  it('delegates warning() to ToastrService', () => {
    service.warning('Be careful', 'Warning');
    expect(toastrSpy.warning).toHaveBeenCalledWith('Be careful', 'Warning');
  });

  it('delegates info() to ToastrService', () => {
    service.info('FYI');
    expect(toastrSpy.info).toHaveBeenCalledWith('FYI', undefined);
  });
});
