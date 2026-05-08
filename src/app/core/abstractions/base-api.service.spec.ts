import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { BaseQueryParams } from './models/base.models';

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserDto {
  name: string;
  email: string;
}

interface UpdateUserDto {
  name?: string;
  email?: string;
}

interface UserQueryParams extends BaseQueryParams {
  search?: string;
  page?: number;
}

@Injectable()
class TestUsersService extends BaseApiService<User, CreateUserDto, UpdateUserDto, UserQueryParams> {
  protected readonly endpoint = '/api/users';
}

describe('BaseApiService', () => {
  let service: TestUsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestUsersService],
    });
    service = TestBed.inject(TestUsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll() sends GET to the endpoint', () => {
    const mockUsers: User[] = [{ id: 1, name: 'Alice', email: 'alice@example.com' }];

    service.getAll().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('getAll() with params appends query string', () => {
    service.getAll({ search: 'alice', page: 2 }).subscribe();

    const req = httpMock.expectOne(r => r.url === '/api/users');
    expect(req.request.params.get('search')).toBe('alice');
    expect(req.request.params.get('page')).toBe('2');
    req.flush([]);
  });

  it('getAll() omits undefined params', () => {
    service.getAll({ search: undefined }).subscribe();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.params.has('search')).toBe(false);
    req.flush([]);
  });

  it('getById() sends GET to /endpoint/:id', () => {
    const mockUser: User = { id: 42, name: 'Bob', email: 'bob@example.com' };

    service.getById(42).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/users/42');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('create() sends POST with body', () => {
    const dto: CreateUserDto = { name: 'Carol', email: 'carol@example.com' };
    const mockUser: User = { id: 3, ...dto };

    service.create(dto).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockUser);
  });

  it('update() sends PUT to /endpoint/:id with body', () => {
    const dto: UpdateUserDto = { name: 'Dave Updated' };
    const mockUser: User = { id: 5, name: 'Dave Updated', email: 'dave@example.com' };

    service.update(5, dto).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/users/5');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dto);
    req.flush(mockUser);
  });

  it('delete() sends DELETE to /endpoint/:id', () => {
    service.delete(7).subscribe();

    const req = httpMock.expectOne('/api/users/7');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
