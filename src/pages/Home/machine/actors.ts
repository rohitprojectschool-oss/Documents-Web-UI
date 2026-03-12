import { fromPromise } from 'xstate';
import type { UserProfile, Country } from './types';
import { fetcher } from '../../../utils/fetcher';
import { URLS } from '../../../constants/urls';
import { mapUser, mapCountries } from '../../../utils/mappers';

export const fetchUser = fromPromise(async (): Promise<UserProfile> => {
  const response: any = await fetcher.get(URLS.AUTH_ME);
  return mapUser(response.data);
});

export const fetchCountries = fromPromise(async (): Promise<Country[]> => {
  const response: any = await fetcher.get(URLS.COUNTRY_SETTINGS);
  const countries = mapCountries(response.data.countries);
  localStorage.setItem('crimson:countries', JSON.stringify(countries));
  return countries;
});
