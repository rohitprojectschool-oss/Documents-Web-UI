import { fromPromise } from 'xstate';
import type { StatsSummary, ActivityPoint, CountryShare, DocTypeShare, RecentDocument } from './types';
import { fetcher } from '../../../utils/fetcher';
import { URLS } from '../../../constants/urls';
import { mapDashboard } from '../../../utils/mappers';

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
