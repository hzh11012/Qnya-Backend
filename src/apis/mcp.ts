import request from '@/lib/request';

export interface McpTool {
  name: string;
  description: string;
}

export interface McpInfoResponse {
  endpoint: string;
  tokenEnabled: boolean;
  tools: McpTool[];
  guide: string;
}

export const fetchMcpInfo = () => {
  return request.get<McpInfoResponse>('/api/admin/mcp/info', {
    showErrorToast: true
  });
};
