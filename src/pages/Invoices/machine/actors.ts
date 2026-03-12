import { fromPromise } from 'xstate';
import type { Invoice, DateRange } from './types';
import { fetcher } from '../../../utils/fetcher';
import { URLS } from '../../../constants/urls';
import { mapInvoices } from '../../../utils/mappers';

export const fetchInvoices = fromPromise(async ({ input }: { input: any }): Promise<Invoice[]> => {
  const params = new URLSearchParams();
  
  if (input.status && input.status !== 'all') {
    params.append('status', input.status);
  }
  
  if (input.countryCode && input.countryCode !== 'all') {
    params.append('countryCode', input.countryCode);
  }

  // Handle Date Range
  if (input.dateRange && input.dateRange !== 'all') {
    const now = new Date();
    let start = new Date();
    
    if (input.dateRange === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (input.dateRange === 'thisWeek') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      start = new Date(now.setDate(diff));
      start.setHours(0, 0, 0, 0);
    } else if (input.dateRange === 'thisMonth') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (input.dateRange === 'thisYear') {
      start = new Date(now.getFullYear(), 0, 1);
    }

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    params.append('startDate', formatDate(start));
    params.append('endDate', formatDate(new Date()));
  }

  const queryString = params.toString();
  const url = queryString ? `${URLS.INVOICES}?${queryString}` : URLS.INVOICES;
  
  const response: any = await fetcher.get(url);
  return mapInvoices(response.data);
});

export const uploadInvoice = fromPromise(async ({ input }: { input: any }): Promise<Invoice> => {
  const formData = new FormData();
  formData.append('file', input.file);
  formData.append('sourceReference', input.sourceReference);
  formData.append('customer', input.customer);
  formData.append('grossAmount', input.grossAmount.toString());
  formData.append('docType', input.docType);
  formData.append('countryCode', input.countryCode);
  
  // Try to find the country name for the backend
  const countriesStr = localStorage.getItem('crimson:country-settings');
  if (countriesStr) {
    try {
      const parsed = JSON.parse(countriesStr);
      const countries = parsed.data || [];
      const country = countries.find((c: any) => c.country_code === input.countryCode);
      if (country) formData.append('countryName', country.country_name);
    } catch (e) {
      console.error('Failed to parse country settings:', e);
    }
  }

  const response: any = await fetcher.post(URLS.INVOICES, formData);
  if (!response.status) throw new Error(response.message || 'Failed to upload invoice');
  
  const mapped = mapInvoices([response.data]);
  return mapped[0];
});
