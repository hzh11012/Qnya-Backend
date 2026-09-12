import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '@/apis/dashboard';
import useDeferredLoading from '@/hooks/use-deferred-loading';

/**
 * 概览统计数据：单一数据源
 * - React Query 自动去重，多个分区共用一次请求
 * - staleTime 30s，分区切换回来时不重复请求
 * - showSkeleton：加载超过 250ms 才显示骨架屏，避免快路径闪烁
 */
export const useDashboardStats = () => {
  const query = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 30_000
  });
  const showSkeleton = useDeferredLoading(query.isPending);

  return { ...query, showSkeleton };
};
