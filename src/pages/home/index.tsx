import { AlertTriangle } from 'lucide-react';
import { useDashboardStats } from '@/pages/home/use-dashboard-stats';
import ContentOverview from '@/pages/home/sections/content-overview';
import InteractionOverview from '@/pages/home/sections/interaction-overview';
import TaskSystemStatus from '@/pages/home/sections/task-system-status';
import OperationData from '@/pages/home/sections/operation-data';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';

const Home = () => {
  const {
    data: stats,
    isPending: loading,
    showSkeleton,
    refetch
  } = useDashboardStats();
  const alertCount = !loading ? (stats?.pending.feedbacks ?? 0) : 0;

  return (
    <div className='flex flex-col gap-6'>
      {/* 页头：网格背景 + 标题节奏，呼应登录页 */}
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
                Dashboard
              </span>
            </div>
            <h1 className='font-display mt-2 font-semibold text-2xl tracking-tight'>
              数据概览
            </h1>
            <p className='mt-1 text-sm text-muted'>
              站点内容、用户互动与任务系统运行情况一览
            </p>
          </div>
          <div className='flex items-center gap-3'>
            {alertCount > 0 && (
              <div className='animate-fade-in flex items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3.5 py-1.5 text-sm text-yellow-600 backdrop-blur-sm dark:text-yellow-400'>
                <AlertTriangle className='size-4 shrink-0' />
                <span>
                  <strong className='font-display'>{alertCount}</strong>{' '}
                  条待处理反馈
                </span>
              </div>
            )}
            <DataTableRefresh
              onRefresh={() => refetch()}
              disabled={loading}
            />
          </div>
        </div>
      </header>

      {/* showSkeleton：仅在加载超过 250ms 后展示骨架，快路径直接渲染内容 */}
      {showSkeleton || stats ? (
        <>
          <ContentOverview
            stats={stats}
            loading={showSkeleton}
          />
          <InteractionOverview
            stats={stats}
            loading={showSkeleton}
          />
          <TaskSystemStatus
            stats={stats}
            loading={showSkeleton}
          />
          <OperationData
            stats={stats}
            loading={showSkeleton}
          />
        </>
      ) : null}
    </div>
  );
};

export default Home;
