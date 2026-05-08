import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Finding } from './finding.model';

@Injectable({ providedIn: 'root' })
export class FindingService {
  getByAudit(_auditId: string): Observable<Finding[]> { return of([]); }
}
