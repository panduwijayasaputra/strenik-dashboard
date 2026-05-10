import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuditTemplate } from '../models/audit-template.model';

@Injectable({ providedIn: 'root' })
export class AuditTemplateService {
  getAll(): Observable<AuditTemplate[]> { return of([]); }
}
