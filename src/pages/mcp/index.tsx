import { useRequest } from 'ahooks';
import { fetchMcpInfo } from '@/apis';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { Skeleton } from '@/components/ui/skeleton';
import { Network, ShieldCheck, ShieldAlert, Wrench, Globe } from 'lucide-react';
import {
  Card,
  SectionTitle,
  InfoRow,
  SkeletonCard,
  ToolCard,
  McpGuide,
  McpIntegration
} from './components';

const Mcp = () => {
  const { data, loading, refresh } = useRequest(fetchMcpInfo, {
    loadingDelay: 150
  });

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-end gap-2'>
        <DataTableRefresh
          onRefresh={refresh}
          disabled={loading}
        />
      </div>

      {loading ? (
        <div className='flex flex-col gap-4'>
          <SkeletonCard rows={2} />
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='rounded-md border bg-card p-4 flex flex-col gap-2'
              >
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-3 w-3/4' />
              </div>
            ))}
          </div>
          <SkeletonCard rows={8} />
        </div>
      ) : data ? (
        <div className='flex flex-col gap-4'>
          <Card>
            <SectionTitle
              icon={Network}
              title='MCP 端点'
            />
            <InfoRow
              icon={Globe}
              label='端点地址'
              value={data.endpoint}
            />
            <InfoRow
              icon={data.tokenEnabled ? ShieldCheck : ShieldAlert}
              label='Token 保护'
              value={data.tokenEnabled ? '已启用' : '未启用'}
              highlight={data.tokenEnabled ? 'success' : 'warning'}
            />
          </Card>

          <McpIntegration
            endpoint={data.endpoint}
            tokenEnabled={data.tokenEnabled}
          />

          {data.tools.length > 0 && (
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2'>
                <Wrench className='size-4 text-primary shrink-0' />
                <span className='font-semibold text-sm'>可用工具</span>
                <span className='ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'>
                  {data.tools.length}
                </span>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3'>
                {data.tools.map(tool => (
                  <ToolCard
                    key={tool.name}
                    tool={tool}
                  />
                ))}
              </div>
            </div>
          )}

          {data.guide && <McpGuide guide={data.guide} />}
        </div>
      ) : null}
    </div>
  );
};

export default Mcp;
