export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  clientName: string;
  allowedCountries: string[];
  roleType: string[];
  status: string;
  uploadsEnabled: boolean;
  isPartner: boolean;
  autoSubmit: boolean;
}

export interface Country {
  countryCode: string;
  countryName: string;
  displayOrder: number;
}

export type HomeRoute = 'dashboard' | 'invoices' | 'customers' | 'analytics' | 'settings' | 'users';

export interface HomeContext {
  user: UserProfile | null;
  countries: Country[];
  activeRoute: HomeRoute;
  error: string | null;
}

export type HomeEvents =
  | { type: 'NAVIGATE'; route: HomeRoute }
  | { type: 'RETRY' };
