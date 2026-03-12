import { fromPromise } from 'xstate';
import type { Customer, CustomerForm } from './types';
import { fetcher } from '../../../utils/fetcher';
import { URLS } from '../../../constants/urls';
import { mapCustomers } from '../../../utils/mappers';

export const fetchCustomers = fromPromise(async (): Promise<Customer[]> => {
  const response: any = await fetcher.get(URLS.CUSTOMERS);
  return mapCustomers(response.data);
});

export const addCustomer = fromPromise(async ({ input }: { input: CustomerForm }): Promise<Customer> => {
  const response: any = await fetcher.post(URLS.CUSTOMERS, input);
  if (!response.status) throw new Error(response.message || 'Failed to add customer');
  const mapped = mapCustomers([response.data]);
  return mapped[0];
});

export const updateCustomer = fromPromise(async ({ input }: { input: { id: string; data: CustomerForm } }): Promise<Customer> => {
  const response: any = await fetcher.put(`${URLS.CUSTOMERS}/${input.id}`, input.data);
  if (!response.status) throw new Error(response.message || 'Failed to update customer');
  const mapped = mapCustomers([response.data]);
  return mapped[0];
});

export const deleteCustomer = fromPromise(async ({ input }: { input: string }): Promise<string> => {
  const response: any = await fetcher.delete(`${URLS.CUSTOMERS}/${input}`);
  if (!response.status) throw new Error(response.message || 'Failed to delete customer');
  return input;
});
