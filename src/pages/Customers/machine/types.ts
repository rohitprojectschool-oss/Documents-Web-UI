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

export interface CustomerForm {
  customer_id: string;
  customer_tax_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address_line1: string;
  customer_address_line2: string;
  customer_state: string;
  customer_country_code: string;
  customer_postal_code: string;
}

export interface CustomersContext {
  customers: Customer[];
  selectedCountry: string;
  searchQuery: string;
  error: string | null;
  showModal: boolean;
  editingId: string | null;
  showDeleteConfirm: string | null; // Stores the ID of the customer to be deleted
  formData: CustomerForm;
}

export type CustomersEvents =
  | { type: 'REFRESH' }
  | { type: 'SELECT_COUNTRY'; country: string }
  | { type: 'SEARCH'; query: string }
  | { type: 'TOGGLE_MODAL'; show: boolean }
  | { type: 'UPDATE_FORM'; field: keyof CustomerForm; value: string }
  | { type: 'ADD_CUSTOMER' }
  | { type: 'EDIT_CUSTOMER'; customer: Customer }
  | { type: 'SAVE_CUSTOMER' }
  | { type: 'CONFIRM_DELETE'; id: string | null }
  | { type: 'DELETE_CUSTOMER' };
