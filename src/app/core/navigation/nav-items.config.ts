import { NavItem } from './nav-item.model';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'layout-dashboard',
    route: '/dashboard',
  },
  {
    label: 'Users',
    icon: 'users',
    children: [
      { label: 'User List', icon: 'list', route: '/users' },
      { label: 'Create User', icon: 'user-plus', route: '/users/create' },
    ],
  },
  {
    label: 'Products',
    icon: 'package',
    children: [
      { label: 'Product List', icon: 'list', route: '/products' },
      { label: 'Create Product', icon: 'plus-circle', route: '/products/create' },
    ],
  },
  {
    label: 'Settings',
    icon: 'settings',
    route: '/settings',
  },
  {
    label: 'Profile',
    icon: 'user',
    route: '/profile',
  },
];
