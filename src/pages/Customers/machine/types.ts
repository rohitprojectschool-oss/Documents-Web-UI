export interface Customer {
  id: string;
  customerId: string;
  taxId: string;
  name: string;
  email: string | null;
  phone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  state: string | null;
  countryCode: string;
  postalCode: string | null;
  createdAt: string;
}

export interface CustomersContext {
  customers: Customer[];
  selectedCountry: string;
  searchQuery: string;
  error: string | null;
}

export type CustomersEvents =
  | { type: 'REFRESH' }
  | { type: 'SELECT_COUNTRY'; country: string }
  | { type: 'SEARCH'; query: string };
