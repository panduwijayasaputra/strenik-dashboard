import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  { path: '', redirectTo: 'severity-levels', pathMatch: 'full' },
  {
    path: 'severity-levels',
    data: { breadcrumb: 'Severity Levels' },
    loadComponent: () => import('./severity-levels/components/severity-level-list/severity-level-list.component').then(m => m.SeverityLevelListComponent),
  },
  {
    path: 'audit-templates',
    data: { breadcrumb: 'Audit Templates' },
    loadChildren: () => import('./audit-templates/audit-templates.routes').then(m => m.AUDIT_TEMPLATES_ROUTES),
  },
];
