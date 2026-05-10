import { Routes } from '@angular/router';

export const AUDITS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./audit-list/audit-list.component').then(m => m.AuditListComponent) },
  { path: 'new', data: { breadcrumb: 'New Audit' }, loadComponent: () => import('./audit-form/audit-form.component').then(m => m.AuditFormComponent) },
  { path: ':id', data: { breadcrumb: 'Audit Detail' }, loadComponent: () => import('./audit-detail/audit-detail.component').then(m => m.AuditDetailComponent) },
];
