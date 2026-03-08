import type { UserProfile, Country } from '../pages/Home/machine/types';
import type { Invoice } from '../pages/Invoices/machine/types';
import type { Customer } from '../pages/Customers/machine/types';
import type { AnalyticsData } from '../pages/Analytics/machine/types';
import type { DashboardData } from '../pages/Dashboard/machine/actors';
import type { SettingsData } from '../pages/Settings/machine/types';

export const mapUser = (raw: any): UserProfile => ({
  userId: raw.user_id,
  email: raw.email,
  name: raw.name,
  clientName: raw.client_name,
  allowedCountries: raw.allowed_countries,
  roleType: raw.role_type,
  status: raw.status,
  uploadsEnabled: raw.uploads_enabled,
  isPartner: raw.is_partner,
  autoSubmit: raw.auto_submit,
});

export const mapCountries = (raw: any[]): Country[] => raw.map(c => ({
  countryCode: c.country_code,
  countryName: c.country_name,
  displayOrder: c.display_order,
}));

export const mapInvoices = (raw: any[]): Invoice[] => raw;

export const mapCustomers = (raw: any[]): Customer[] => raw.map(c => ({
  id: c.id,
  customerId: c.customer_id,
  customerTaxId: c.customer_tax_id,
  customerName: c.customer_name,
  customerEmail: c.customer_email,
  customerPhone: c.customer_phone,
  customerAddressLine1: c.customer_address_line1,
  customerAddressLine2: c.customer_address_line2,
  customerState: c.customer_state,
  customerCountryCode: c.customer_country_code,
  customerPostalCode: c.customer_postal_code,
  createdAt: c.created_at,
  updatedAt: c.updated_at,
  // Add direct mappings for common UI accessors if needed
  taxId: c.customer_tax_id,
  name: c.customer_name,
  email: c.customer_email,
  phone: c.customer_phone,
  countryCode: c.customer_country_code,
}));

export const mapAnalytics = (raw: any): AnalyticsData => raw;

export const mapDashboard = (raw: any): DashboardData => raw;

export const mapSettings = (raw: any): SettingsData => ({
  profile: {
    name: raw.name,
    nif: raw.nif || '',
    email: raw.email,
    addressLine1: raw.address_line1 || '',
    address_line2: raw.address_line2 || '',
    city: raw.city || '',
    state: raw.state || '',
    country: raw.country || '',
    postalCode: raw.postal_code || '',
  },
  invoiceTerms: raw.invoice_terms || 'Generic text common to all invoices',
  apiKey: raw.api_key,
  autoSubmit: raw.auto_submit,
});
