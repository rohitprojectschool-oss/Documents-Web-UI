// Use environment variable for BASE_URL with the Render service as a fallback
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://documents-web-services.onrender.com';

export const URLS = {
  AUTH_ME: '/auth/me',
  COUNTRY_SETTINGS: '/api/country-settings/public',
  INVOICES: '/api/invoices',
  CUSTOMERS: '/api/customers',
  ANALYTICS: '/api/analytics',
  DASHBOARD: '/api/dashboard',
  USERS: '/api/users',
  SETTINGS_SAVE: '/api/settings/save',
  PASSWORD_CHANGE: '/api/settings/change-password',
  API_KEY_GENERATE: '/api/settings/generate-api-key',
} as const;
