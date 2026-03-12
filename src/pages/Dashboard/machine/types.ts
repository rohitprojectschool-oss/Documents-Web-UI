export interface StatsSummary {
  totalDocuments: number;
  pending: number;
  completed: number;
  rejected: number;
}

export interface ActivityPoint {
  date: string;
  count: number;
}

export interface CountryShare {
  name: string;
  value: number;
  color: string;
}

export interface DocTypeShare {
  type: string;
  percentage: number;
  color: string;
}

export interface RecentDocument {
  docId: string;
  sourceReference: string;
  customer: string;
  grossAmount: string;
  created: string;
  status: 'accepted' | 'rejected' | 'pending';
  docType: string;
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

export interface DashboardContext {
  stats: StatsSummary | null;
  activityData: ActivityPoint[];
  countryData: CountryShare[];
  docDistribution: DocTypeShare[];
  recentDocuments: RecentDocument[];
  error: string | null;
  showModal: boolean;
  selectedDocument: RecentDocument | null;
  formData: InvoiceForm;
}

export type DashboardEvents = 
  | { type: 'REFRESH' }
  | { type: 'TOGGLE_MODAL'; show: boolean }
  | { type: 'UPDATE_FORM'; field: keyof InvoiceForm; value: string | File | null }
  | { type: 'UPLOAD_DOCUMENT' }
  | { type: 'OPEN_DETAILS'; document: RecentDocument }
  | { type: 'CLOSE_DETAILS' };
