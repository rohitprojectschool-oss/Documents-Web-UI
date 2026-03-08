import { fromPromise } from 'xstate';
import type { Customer } from './types';
import { fetcher } from '../../../utils/fetcher';
import { URLS } from '../../../constants/urls';
import { mapCustomers } from '../../../utils/mappers';

export const fetchCustomers = fromPromise(async (): Promise<Customer[]> => {
  const response: any = await fetcher.get(URLS.CUSTOMERS);
  return mapCustomers(response.data);
});

export const addCustomer = fromPromise(async ({ input }: { input: any }): Promise<Customer> => {
  const response: any = await fetcher.post(URLS.CUSTOMERS, input);
  if (!response.status) throw new Error(response.message || 'Failed to add customer');
  
  // Reuse the mapper for the single customer result by wrapping it in an array
  const mapped = mapCustomers([response.data]);
  return mapped[0];
});
