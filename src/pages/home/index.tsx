import { useRequest } from 'ahooks';
import { fetchDashboardStats } from '@/apis';
import type { DashboardStatsResponse } from '@/apis';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import ContentOverview from './content-overview';
import InteractionOverview from './interaction-overview';
import TaskSystemStatus from './task-system-status';
import OperationData from './operation-data';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';

const Home = () => {
  const { data, loading, refresh } = useRequest(fetchDashboardStats, {
    loadingDelay: 150
  });

  const stats = data as DashboardStatsResponse | undefined;

  return (
    <div className='flex flex-col gap-4'>
      {/* 告警行 + 刷新按钮 */}
      <div className='flex items-center gap-3'>
        <div className='flex flex-wrap gap-3 flex-1'>
          {!loading && stats && stats.pending.feedbacks > 0 && (
            <div className='flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-900 px-4 py-1.75 text-sm text-yellow-700 dark:text-yellow-400'>
              <AlertTriangle className='size-4 shrink-0' />
              <span>
                有 <strong>{stats.pending.feedbacks}</strong> 条待处理反馈
              </span>
            </div>
          )}
          {!loading && stats && stats.pending.failedTasks > 0 && (
            <div className='flex items-center gap-2 rounded-md border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 px-4 py-1.75 text-sm text-red-700 dark:text-red-400'>
              <AlertCircle className='size-4 shrink-0' />
              <span>
                有 <strong>{stats.pending.failedTasks}</strong> 个失败任务
              </span>
            </div>
          )}
        </div>
        <DataTableRefresh
          onRefresh={refresh}
          disabled={loading}
        />
      </div>
      <ContentOverview
        stats={stats}
        loading={loading}
      />
      <InteractionOverview
        stats={stats}
        loading={loading}
      />
      <TaskSystemStatus
        stats={stats}
        loading={loading}
      />
      <OperationData
        stats={stats}
        loading={loading}
      />
    </div>
  );
};

export default Home;
