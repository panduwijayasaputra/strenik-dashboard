import { Routes } from '@angular/router';

export const ORGANIZATION_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./components/organization-list/organization-list.component').then(m => m.OrganizationListComponent) },
  { path: 'new', loadComponent: () => import('./components/organization-form/organization-form.component').then(m => m.OrganizationFormComponent) },
  { path: 'settings', loadComponent: () => import('./components/organization-settings/organization-settings.component').then(m => m.OrganizationSettingsComponent) },
];
