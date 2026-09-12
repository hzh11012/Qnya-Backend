import type { DashboardStatsResponse } from '@/apis/dashboard';

/** 概览页各分区共享的 props */
export interface OverviewSectionProps {
  stats: DashboardStatsResponse | undefined;
  loading: boolean;
}
