import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/user-list/user-list.component').then(m => m.UserListComponent),
  },
  {
    path: 'new',
    data: { breadcrumb: 'Create User' },
    loadComponent: () =>
      import('./components/user-form/user-form.component').then(m => m.UserFormComponent),
  },
];
