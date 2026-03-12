import { fromPromise } from 'xstate';
import type { StatsSummary, ActivityPoint, CountryShare, DocTypeShare, RecentDocument } from './types';
import { fetcher } from '../../../utils/fetcher';
import { URLS } from '../../../constants/urls';
import { mapDashboard, mapInvoices } from '../../../utils/mappers';

export interface DashboardData {
  stats: StatsSummary;
  activityData: ActivityPoint[];
  countryData: CountryShare[];
  docDistribution: DocTypeShare[];
  recentDocuments: RecentDocument[];
}

export const fetchDashboardData = fromPromise(async (): Promise<DashboardData> => {
  const response: any = await fetcher.get(URLS.DASHBOARD);
  return mapDashboard(response.data);
});

export const uploadInvoice = fromPromise(async ({ input }: { input: any }): Promise<RecentDocument> => {
  const formData = new FormData();
  formData.append('file', input.file);
  formData.append('sourceReference', input.sourceReference);
  formData.append('customer', input.customer);
  formData.append('grossAmount', input.grossAmount.toString());
  formData.append('docType', input.docType);
  formData.append('countryCode', input.countryCode);
  
  // We need to fetch country name for the backend
  const countriesStr = localStorage.getItem('crimson:countries');
  if (countriesStr) {
    const countries = JSON.parse(countriesStr);
    const country = countries.find((c: any) => c.code === input.countryCode);
    if (country) formData.append('countryName', country.name);
  }

  const response: any = await fetcher.post(URLS.INVOICES, formData);
  if (!response.status) throw new Error(response.message || 'Failed to upload invoice');
  
  // mapInvoices returns RecentDocument style objects
  const mapped = mapInvoices([response.data]);
  return mapped[0] as RecentDocument;
});
