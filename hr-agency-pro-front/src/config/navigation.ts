export interface NavItem {
  label: string;
  to: string;
  permission: string;
  hiddenFor?: string[];  // hide if user has any of these permissions
  visibleFor?: string[]; // only show if user has at least one of these permissions
}

export const navigationItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', permission: 'dashboard' },
  { label: 'Client Dashboard', to: '/client-dashboard', permission: 'client_dashboard', visibleFor: ['client_dashboard'] },
  { label: 'Invoices', to: '/invoices', permission: 'client_dashboard', visibleFor: ['client_dashboard'] },
  { label: 'Hero Dashboard', to: '/hero-dashboard', permission: 'hero_dashboard', visibleFor: ['hero_dashboard'] },
  { label: 'My Profile', to: '/hero-profile', permission: 'hero_dashboard', visibleFor: ['hero_dashboard'] },
  { label: 'My Contracts', to: '/contracts', permission: 'contracts:read', visibleFor: ['hero_dashboard'] },
  { label: 'My Invoices', to: '/invoices', permission: 'invoices:read', visibleFor: ['hero_dashboard'] },
  { label: 'Prospect Dashboard', to: '/prospect-dashboard', permission: 'prospect_dashboard', visibleFor: ['prospect_dashboard'] },
  { label: 'Prospects', to: '/prospects', permission: 'prospects' },
  { label: 'Prospect Database', to: '/prospect-database', permission: 'prospects' },
  { label: 'Heroes', to: '/heroes', permission: 'heroes:read', hiddenFor: ['hero_dashboard'] },
  { label: 'Clients', to: '/clients', permission: 'companies' },
  { label: 'Contracts', to: '/contracts', permission: 'contracts' },
  { label: 'Invoices', to: '/invoices', permission: 'invoices' },
  { label: 'Interviews', to: '/interviews', permission: 'interviews' },
  { label: 'Jobs', to: '/jobs', permission: 'jobs' },
  { label: 'Shopping', to: '/job-requests', permission: 'job-requests' },
  { label: 'Users', to: '/users', permission: 'users' },
  { label: 'Roles', to: '/roles', permission: 'roles' },
  { label: 'Settings', to: '/settings', permission: 'settings' },
];
