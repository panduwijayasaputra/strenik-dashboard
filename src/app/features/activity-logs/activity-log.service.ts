import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivityLog } from './activity-log.model';

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  getAll(): Observable<ActivityLog[]> { return of([]); }
}
