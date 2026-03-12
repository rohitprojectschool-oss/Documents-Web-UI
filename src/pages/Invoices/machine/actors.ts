import { fromPromise } from 'xstate';
import type { Invoice } from './types';
import { fetcher } from '../../../utils/fetcher';
import { URLS } from '../../../constants/urls';
import { mapInvoices } from '../../../utils/mappers';

export const fetchInvoices = fromPromise(async (): Promise<Invoice[]> => {
  const response: any = await fetcher.get(URLS.INVOICES);
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
