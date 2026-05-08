import { Routes } from '@angular/router';

export const AUDIT_TEMPLATES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./components/audit-template-list/audit-template-list.component').then(m => m.AuditTemplateListComponent) },
  { path: 'new', loadComponent: () => import('./components/audit-template-form/audit-template-form.component').then(m => m.AuditTemplateFormComponent) },
];
