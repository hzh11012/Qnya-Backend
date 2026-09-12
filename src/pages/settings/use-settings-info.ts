import { useQuery } from '@tanstack/react-query';
import { fetchSettingsInfo } from '@/apis/settings';
import useDeferredLoading from '@/hooks/use-deferred-loading';

/** 系统信息：服务器、qBittorrent、SMTP、数据库、Session、安全、资源、TMDB */
export const useSettingsInfo = () => {
  const query = useQuery({
    queryKey: ['settings', 'info'],
    queryFn: fetchSettingsInfo,
    staleTime: 30_000
  });
  const showSkeleton = useDeferredLoading(query.isPending);

  return { ...query, showSkeleton };
};
