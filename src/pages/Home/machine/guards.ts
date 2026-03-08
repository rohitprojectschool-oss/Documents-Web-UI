import type { HomeContext, HomeEvents, HomeRoute } from './types';

const matchesRoute =
  (route: HomeRoute) =>
  ({ event }: { context: HomeContext; event: HomeEvents }) =>
    event.type === 'NAVIGATE' && event.route === route;

export const isDashboard = matchesRoute('dashboard');
export const isInvoices = matchesRoute('invoices');
export const isCustomers = matchesRoute('customers');
export const isAnalytics = matchesRoute('analytics');
export const isSettings = matchesRoute('settings');
export const isUsers = matchesRoute('users');
