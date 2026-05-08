import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { ModalService } from './modal.service';

@Component({ selector: 'app-dummy', standalone: true, template: '' })
class DummyComponent {}

describe('ModalService', () => {
  let service: ModalService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);

    TestBed.configureTestingModule({
      providers: [
        ModalService,
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });
    service = TestBed.inject(ModalService);
  });

  it('delegates open() to MatDialog', () => {
    service.open(DummyComponent, { width: '400px' });
    expect(dialogSpy.open).toHaveBeenCalledWith(DummyComponent, { width: '400px' });
  });

  it('delegates closeAll() to MatDialog', () => {
    service.closeAll();
    expect(dialogSpy.closeAll).toHaveBeenCalled();
  });
});
