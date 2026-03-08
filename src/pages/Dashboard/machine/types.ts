export interface StatsSummary {
  totalDocuments: number;
  pending: number;
  completed: number;
  rejected: number;
}

export interface ActivityPoint {
  date: string;
  count: number;
}

export interface CountryShare {
  name: string;
  value: number;
  color: string;
}

export interface DocTypeShare {
  type: string;
  percentage: number;
  color: string;
}

export interface RecentDocument {
  docId: string;
  sourceReference: string;
  customer: string;
  grossAmount: string;
  created: string;
  status: 'accepted' | 'rejected' | 'pending';
  docType: string;
}

export interface DashboardContext {
  stats: StatsSummary | null;
  activityData: ActivityPoint[];
  countryData: CountryShare[];
  docDistribution: DocTypeShare[];
  recentDocuments: RecentDocument[];
  error: string | null;
}

export type DashboardEvents = { type: 'REFRESH' };
