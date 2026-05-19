import request from '@/lib/request';

interface DashboardStatsContent {
  animeTotal: number;
  animeByStatus: {
    draft: number;
    upcoming: number;
    airing: number;
    completed: number;
  };
  animeByType: {
    movie: number;
    japanese: number;
    american: number;
    chinese: number;
    adult: number;
  };
  videoTotal: number;
  seriesTotal: number;
  topicTotal: number;
}

interface DashboardStatsUsers {
  total: number;
  active: number;
  byRole: {
    admin: number;
    premium: number;
    user: number;
    guest: number;
  };
}

interface DashboardStatsInteraction {
  danmakuTotal: number;
  historyTotal: number;
  collectionTotal: number;
  scoreTotal: number;
}

interface DashboardStatsTasks {
  pending: number;
  completed: number;
}

interface DashboardStatsPending {
  feedbacks: number;
}

interface TopCollectionItem {
  animeId: number;
  animeName: string;
  cover: string;
  count: number;
}

interface RecentFeedbackItem {
  id: number;
  animeName: string;
  type: string;
  content: string;
  createdAt: string;
}

interface RecentScoreItem {
  id: number;
  userName: string;
  animeName: string;
  score: number;
  content: string;
  createdAt: string;
}

interface DashboardStatsSystem {
  database: {
    status: 'ok' | 'error';
    latency?: number;
  };
  redis: {
    status: 'ok' | 'error';
    latency?: number;
  };
}

export interface DashboardStatsResponse {
  content: DashboardStatsContent;
  users: DashboardStatsUsers;
  interaction: DashboardStatsInteraction;
  tasks: DashboardStatsTasks;
  pending: DashboardStatsPending;
  topCollections: TopCollectionItem[];
  recentFeedbacks: RecentFeedbackItem[];
  recentScores: RecentScoreItem[];
  system: DashboardStatsSystem;
}

const fetchDashboardStats = () => {
  return request.get<DashboardStatsResponse>('/api/admin/dashboard/stats', {
    showErrorToast: true
  });
};

export {
  fetchDashboardStats,
  type TopCollectionItem,
  type RecentFeedbackItem,
  type RecentScoreItem
};
