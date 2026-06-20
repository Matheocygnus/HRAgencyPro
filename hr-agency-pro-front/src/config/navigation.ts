export interface NavItem {
  label: string;
  to: string;
  permission: string;
}

export const navigationItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', permission: 'dashboard' },
  { label: 'Client Dashboard', to: '/client-dashboard', permission: 'client_dashboard' },
  { label: 'Invoices', to: '/invoices', permission: 'client_dashboard' },
  { label: 'Hero Dashboard', to: '/hero-dashboard', permission: 'hero_dashboard' },
  { label: 'Prospect Dashboard', to: '/prospect-dashboard', permission: 'prospect_dashboard' },
  { label: 'Prospects', to: '/prospects', permission: 'prospects' },
  { label: 'Prospect Database', to: '/prospect-database', permission: 'prospects' },
  { label: 'Heroes', to: '/heroes', permission: 'heroes:read' },
  { label: 'Clients', to: '/clients', permission: 'companies' },
  { label: 'Contracts', to: '/contracts', permission: 'contracts' },
  { label: 'Invoices', to: '/invoices', permission: 'invoices' },
  { label: 'Interviews', to: '/interviews', permission: 'interviews' },
  { label: 'Jobs', to: '/jobs', permission: 'jobs' },
  { label: 'Users', to: '/users', permission: 'users' },
  { label: 'Roles', to: '/roles', permission: 'roles' },
  { label: 'Settings', to: '/settings', permission: 'settings' },
];
