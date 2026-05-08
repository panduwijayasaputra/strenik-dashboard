import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseQueryParams } from './models/base.models';

export abstract class BaseApiService<
  T,
  TCreateDto,
  TUpdateDto,
  TQueryParams extends BaseQueryParams = BaseQueryParams,
> {
  private readonly http = inject(HttpClient);

  protected abstract readonly endpoint: string;

  getAll(params?: TQueryParams): Observable<T[]> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        const value = params[key];
        if (value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      }
    }
    return this.http.get<T[]>(this.endpoint, { params: httpParams });
  }

  getById(id: string | number): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${id}`);
  }

  create(dto: TCreateDto): Observable<T> {
    return this.http.post<T>(this.endpoint, dto);
  }

  update(id: string | number, dto: TUpdateDto): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/${id}`, dto);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
