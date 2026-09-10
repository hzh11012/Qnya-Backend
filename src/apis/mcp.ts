import request from '@/lib/request';
import type { ApiData } from '@/types/helpers';

type McpInfoRes = ApiData<'/api/admin/mcp/info'>;

export type McpInfoResponse = McpInfoRes;
export type McpTool = McpInfoRes['tools'][number];

export const fetchMcpInfo = () => {
  return request.get<McpInfoResponse>('/api/admin/mcp/info', {
    showErrorToast: true
  });
};
