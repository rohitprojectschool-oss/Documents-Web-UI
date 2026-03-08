export interface CountryStat {
  countryCode: string;
  countryName: string;
  total: number;
  accepted: number;
  rejected: number;
  pending: number;
}

export interface MonthlyPoint {
  month: string;
  [countryCode: string]: number | string;
}

export interface DocTypeStat {
  name: string;
  count: number;
  color: string;
}

export interface AnalyticsData {
  totalDocuments: number;
  acceptanceRate: number;
  rejectionRate: number;
  activeCountries: number;
  countryStats: CountryStat[];
  monthlyTrends: MonthlyPoint[];
  docTypeStats: DocTypeStat[];
}

export interface AnalyticsContext {
  data: AnalyticsData | null;
  error: string | null;
}

export type AnalyticsEvents = { type: 'REFRESH' };
