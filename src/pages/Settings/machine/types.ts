export interface ProfileData {
  name: string;
  nif: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface SettingsData {
  profile: ProfileData;
  invoiceTerms: string;
  apiKey: string;
  autoSubmit: boolean;
}

export interface SettingsContext {
  data: SettingsData | null;
  error: string | null;
}

export type SettingsEvents =
  | { type: 'REFRESH' }
  | { type: 'SAVE' };
