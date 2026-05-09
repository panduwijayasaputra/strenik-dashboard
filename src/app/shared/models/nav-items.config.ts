import { environment } from '../../../environments/environment';
import { NavItem } from './nav-item.model';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'layout-dashboard', route: '/dashboard' },
  {
    label: 'Users',
    icon: 'users',
    children: [
      { label: 'User List', icon: 'list', route: '/users' },
      { label: 'Create User', icon: 'user-plus', route: '/users/new' },
    ],
  },
  {
    label: 'Audits',
    icon: 'shield-check',
    children: [
      { label: 'Audit List', icon: 'list', route: '/audits' },
    ],
  },
  { label: 'Organization', icon: 'building', route: '/organization' },
  { label: 'Activity Logs', icon: 'activity', route: '/activity-logs' },
  { label: 'Settings', icon: 'settings', route: '/settings' },
  ...(!environment.production
    ? [{ label: 'Form Components', icon: 'layout-list', route: '/dev/forms' }]
    : []),
];
