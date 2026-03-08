import { fromPromise } from 'xstate';
import type { SettingsData } from './types';
import { fetcher } from '../../../utils/fetcher';
import { URLS } from '../../../constants/urls';
import { mapSettings } from '../../../utils/mappers';

export const fetchSettingsData = fromPromise(async (): Promise<SettingsData> => {
  const response: any = await fetcher.get(URLS.AUTH_ME);
  return mapSettings(response.data);
});
