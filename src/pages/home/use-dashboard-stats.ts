import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '@/apis/dashboard';

/**
 * 概览统计数据：单一数据源
 * - React Query 自动去重，多个分区共用一次请求
 * - staleTime 30s，分区切换回来时不重复请求
 */
export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 30_000
  });
