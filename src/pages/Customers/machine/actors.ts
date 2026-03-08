import { fromPromise } from 'xstate';
import type { Customer } from './types';
import { fetcher } from '../../../utils/fetcher';
import { URLS } from '../../../constants/urls';
import { mapCustomers } from '../../../utils/mappers';

export const fetchCustomers = fromPromise(async (): Promise<Customer[]> => {
  const response: any = await fetcher.get(URLS.CUSTOMERS);
  return mapCustomers(response.data);
});
