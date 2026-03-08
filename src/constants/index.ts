export const ROUTES = {
  DASHBOARD: 'dashboard',
  INVOICES: 'invoices',
  CUSTOMERS: 'customers',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
  USERS: 'users',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
