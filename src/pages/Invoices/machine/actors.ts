import { fromPromise } from 'xstate';
import type { Invoice } from './types';
import { fetcher } from '../../../utils/fetcher';
import { URLS } from '../../../constants/urls';
import { mapInvoices } from '../../../utils/mappers';

export const fetchInvoices = fromPromise(async (): Promise<Invoice[]> => {
  const response: any = await fetcher.get(URLS.INVOICES);
  return mapInvoices(response.data);
});
