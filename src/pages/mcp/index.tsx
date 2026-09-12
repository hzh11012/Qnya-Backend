import { useMcpInfo } from './use-mcp-info';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { SectionHeader } from '@/components/custom/overview/card';
import { Skeleton } from '@/components/ui/skeleton';
import { InfoRow } from '@/components/custom/overview/info-row';
import { SkeletonInfoCard } from '@/components/custom/overview/skeleton';
import { OverviewCard, CardTitle } from '@/components/custom/overview/card';
import { McpGuide, McpIntegration, ToolCard } from './components';
import { Globe, Network, ShieldAlert, ShieldCheck } from 'lucide-react';

const Mcp = () => {
  const { data, isPending: loading, showSkeleton, refetch } = useMcpInfo();

  return (
    <div className='flex flex-col gap-6'>
      {/* 页头：与概览页同一节奏 */}
      <header className='animate-fade-up relative overflow-hidden rounded-xl border border-border/60 bg-card/40 backdrop-blur-md'>
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 bg-grid opacity-50'
        />
        <div className='relative flex flex-wrap items-end justify-between gap-4 p-6'>
          <div>
            <div className='flex items-center gap-3'>
              <div
                aria-hidden
                className='h-px w-10 bg-linear-to-r from-primary/60 to-transparent'
              />
              <span className='font-display text-[11px] font-medium uppercase tracking-[0.3em] text-muted'>
                MCP
              </span>
            </div>
            <h1 className='font-display mt-2 font-semibold text-2xl tracking-tight'>
              MCP 服务
            </h1>
            <p className='mt-1 text-sm text-muted'>
              Model Context Protocol 端点、可用工具与 Agent 接入配置
            </p>
          </div>
          <DataTableRefresh
            onRefresh={() => refetch()}
            disabled={loading}
          />
        </div>
      </header>

      {showSkeleton ? (
        <div className='flex flex-col gap-4'>
          <SkeletonInfoCard rows={2} />
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                aria-hidden
                className='flex flex-col gap-2 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-md'
              >
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-3 w-3/4' />
              </div>
            ))}
          </div>
          <SkeletonInfoCard rows={8} />
        </div>
      ) : data ? (
        <>
          {/* 服务端点 */}
          <section className='flex flex-col gap-4'>
            <SectionHeader
              label='Endpoint'
              title='服务端点'
            />
            <div className='animate-fade-up'>
              <OverviewCard>
                <CardTitle icon={Network}>连接信息</CardTitle>
                <div className='flex flex-col'>
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
                </div>
              </OverviewCard>
            </div>
          </section>

          {/* 接入 Agent */}
          <section className='animate-fade-up flex flex-col gap-4 [animation-delay:90ms]'>
            <SectionHeader
              label='Integration'
              title='接入配置'
            />
            <McpIntegration
              endpoint={data.endpoint}
              tokenEnabled={data.tokenEnabled}
            />
          </section>

          {/* 可用工具 */}
          {data.tools.length > 0 && (
            <section className='flex flex-col gap-4'>
              <SectionHeader
                label='Tools'
                title='可用工具'
              >
                <span className='font-display rounded-full border border-border/50 bg-card/40 px-2.5 py-0.5 text-xs tabular-nums text-muted backdrop-blur-sm'>
                  {data.tools.length}
                </span>
              </SectionHeader>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                {data.tools.map((tool, i) => (
                  <ToolCard
                    key={tool.name}
                    tool={tool}
                    delay={i * 60}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 操作指南 */}
          {data.guide && (
            <section className='animate-fade-up flex flex-col gap-4'>
              <SectionHeader
                label='Guide'
                title='操作指南'
              />
              <McpGuide guide={data.guide} />
            </section>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Mcp;
