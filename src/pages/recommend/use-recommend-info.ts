import { useQuery } from '@tanstack/react-query';
import { fetchRecommendStatus } from '@/apis/recommend';
import useDeferredLoading from '@/hooks/use-deferred-loading';

/** 推荐系统状态：共现矩阵最近重建时间、亲和记录数、可推荐番剧数 */
export const useRecommendInfo = () => {
  const query = useQuery({
    queryKey: ['recommend', 'status'],
    queryFn: fetchRecommendStatus,
    staleTime: 30_000
  });
  const showSkeleton = useDeferredLoading(query.isPending);

  return { ...query, showSkeleton };
};
