import { useQuery } from '@tanstack/react-query';
import { fetchMcpInfo } from '@/apis/mcp';
import useDeferredLoading from '@/hooks/use-deferred-loading';

/** MCP 服务信息：端点、Token 状态、工具列表、接入指南 */
export const useMcpInfo = () => {
  const query = useQuery({
    queryKey: ['mcp', 'info'],
    queryFn: fetchMcpInfo,
    staleTime: 30_000
  });
  const showSkeleton = useDeferredLoading(query.isPending);

  return { ...query, showSkeleton };
};
