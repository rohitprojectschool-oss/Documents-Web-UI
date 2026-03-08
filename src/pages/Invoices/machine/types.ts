export interface Invoice {
  docId: string;
  sourceReference: string;
  customer: string;
  grossAmount: string;
  created: string;
  status: 'accepted' | 'rejected' | 'pending';
  docType: string;
  countryCode: string;
  countryName: string;
}

export interface InvoicesContext {
  invoices: Invoice[];
  selectedCountry: string;
  selectedStatus: string;
  searchQuery: string;
  error: string | null;
}

export type InvoicesEvents =
  | { type: 'REFRESH' }
  | { type: 'SELECT_COUNTRY'; country: string }
  | { type: 'SELECT_STATUS'; status: string }
  | { type: 'SEARCH'; query: string }
  | { type: 'UPLOAD_INVOICE'; data: any };
