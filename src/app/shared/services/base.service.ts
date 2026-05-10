import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseService {
  private readonly http = inject(HttpClient);

  protected get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(environment.apiUrl + path, { params });
  }

  protected post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(environment.apiUrl + path, body);
  }

  protected put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(environment.apiUrl + path, body);
  }

  protected patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(environment.apiUrl + path, body);
  }

  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(environment.apiUrl + path);
  }
}
