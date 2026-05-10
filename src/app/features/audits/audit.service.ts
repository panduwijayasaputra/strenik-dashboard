import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Audit } from './audit.model';

@Injectable({ providedIn: 'root' })
export class AuditService {
  getAll(): Observable<Audit[]> { return of([]); }
  getById(_id: string): Observable<Audit | undefined> { return of(undefined); }
}
