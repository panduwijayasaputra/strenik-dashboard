import { Routes } from '@angular/router';

export const AUDITS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./audit-list/audit-list.component').then(m => m.AuditListComponent) },
  { path: 'new', loadComponent: () => import('./audit-form/audit-form.component').then(m => m.AuditFormComponent) },
  { path: ':id', loadComponent: () => import('./audit-detail/audit-detail.component').then(m => m.AuditDetailComponent) },
];
