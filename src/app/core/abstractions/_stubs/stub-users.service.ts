// STUB — for reference only. Not for production use.
import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { BaseQueryParams } from '../models/base.models';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
}

export interface UserQueryParams extends BaseQueryParams {
  search?: string;
  role?: 'admin' | 'user';
  page?: number;
  pageSize?: number;
}

/**
 * STUB service extending BaseApiService.
 * Demonstrates how to create a typed API service for a specific entity.
 * In real usage, this would point at /api/users and rely on interceptors for auth.
 */
@Injectable({ providedIn: 'root' })
export class StubUsersService extends BaseApiService<
  User,
  CreateUserDto,
  UpdateUserDto,
  UserQueryParams
> {
  protected readonly endpoint = '/api/users';
}
