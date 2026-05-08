import { Routes } from '@angular/router';

export const ACTIVITY_LOGS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./activity-log-list.component').then(m => m.ActivityLogListComponent) },
];
