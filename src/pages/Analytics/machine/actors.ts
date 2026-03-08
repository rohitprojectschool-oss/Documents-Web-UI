import { fromPromise } from 'xstate';
import type { AnalyticsData } from './types';
import { fetcher } from '../../../utils/fetcher';
import { URLS } from '../../../constants/urls';
import { mapAnalytics } from '../../../utils/mappers';

export const fetchAnalyticsData = fromPromise(async (): Promise<AnalyticsData> => {
  const response: any = await fetcher.get(URLS.ANALYTICS);
  return mapAnalytics(response.data);
});
