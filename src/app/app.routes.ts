import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { canActivateDev } from './shared/guards/dev.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dev/forms',
    canActivate: [canActivateDev],
    loadComponent: () =>
      import('./features/dev/forms/dev-forms.component').then(m => m.DevFormsComponent),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./layout/empty-layout/empty-layout.component').then(m => m.EmptyLayoutComponent),
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'users',
        data: { breadcrumb: 'Users' },
        loadChildren: () =>
          import('./features/users/users.routes').then(m => m.USERS_ROUTES),
      },
      {
        path: 'audits',
        data: { breadcrumb: 'Audits' },
        loadChildren: () =>
          import('./features/audits/audits.routes').then(m => m.AUDITS_ROUTES),
      },
      {
        path: 'organization',
        data: { breadcrumb: 'Organization' },
        loadChildren: () =>
          import('./features/organization/organization.routes').then(m => m.ORGANIZATION_ROUTES),
      },
      {
        path: 'activity-logs',
        data: { breadcrumb: 'Activity Logs' },
        loadChildren: () =>
          import('./features/activity-logs/activity-logs.routes').then(m => m.ACTIVITY_LOGS_ROUTES),
      },
      {
        path: 'settings',
        data: { breadcrumb: 'Settings' },
        loadChildren: () =>
          import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
  },
];
