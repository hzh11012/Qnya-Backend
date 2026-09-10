import request from '@/lib/request';
import type { ApiData } from '@/types/helpers';

type DashboardStatsRes = ApiData<'/api/admin/dashboard/stats'>;

export type DashboardStatsResponse = DashboardStatsRes;
export type TopCollectionItem = DashboardStatsRes['topCollections'][number];
export type RecentFeedbackItem = DashboardStatsRes['recentFeedbacks'][number];
export type RecentScoreItem = DashboardStatsRes['recentScores'][number];

const fetchDashboardStats = () => {
  return request.get<DashboardStatsResponse>('/api/admin/dashboard/stats', {
    showErrorToast: true
  });
};

export { fetchDashboardStats };
