import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardStats } from './dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  getStats(): Observable<DashboardStats> {
    return of({ totalAudits: 0, openFindings: 0, completedAudits: 0, pendingRemediation: 0 });
  }
}
