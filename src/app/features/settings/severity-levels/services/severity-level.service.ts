import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SeverityLevel } from '../models/severity-level.model';

@Injectable({ providedIn: 'root' })
export class SeverityLevelService {
  getAll(): Observable<SeverityLevel[]> { return of([]); }
}
