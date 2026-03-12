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
  hasAttachment?: boolean;
  fileUrl?: string | null;
}

export interface InvoiceForm {
  sourceReference: string;
  customer: string;
  grossAmount: string;
  docType: string;
  countryCode: string;
  file: File | null;
}

export type DateRange = 'all' | 'today' | 'thisWeek' | 'thisMonth' | 'thisYear' | 'customDays';

export interface InvoicesContext {
  invoices: Invoice[];
  selectedCountry: string;
  selectedStatus: string;
  searchQuery: string;
  dateRange: DateRange;
  withDocsOnly: boolean;
  error: string | null;
  showModal: boolean;
  selectedDocument: Invoice | null;
  formData: InvoiceForm;
}

export type InvoicesEvents =
  | { type: 'REFRESH' }
  | { type: 'SELECT_COUNTRY'; country: string }
  | { type: 'SELECT_STATUS'; status: string }
  | { type: 'SELECT_DATE_RANGE'; range: DateRange }
  | { type: 'TOGGLE_WITH_DOCS_ONLY'; value: boolean }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SEARCH'; query: string }
  | { type: 'TOGGLE_MODAL'; show: boolean }
  | { type: 'UPDATE_FORM'; field: keyof InvoiceForm; value: string | File | null }
  | { type: 'UPLOAD_DOCUMENT' }
  | { type: 'OPEN_DETAILS'; document: Invoice }
  | { type: 'CLOSE_DETAILS' };
