import type { DashboardStatsResponse } from '@/apis';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Database,
  RefreshCw,
  Server,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusDot } from './components';
import { taskStatusMap } from '@/pages/tasks/columns';

interface Props {
  stats: DashboardStatsResponse | undefined;
  loading: boolean;
}

const TASK_STATUS_UI: Record<string, { icon: React.ElementType; cls: string }> =
  {
    pending: {
      icon: Circle,
      cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
    },
    transcoding: {
      icon: RefreshCw,
      cls: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
    },
    transcoded: {
      icon: AlertTriangle,
      cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
    },
    completed: {
      icon: CheckCircle2,
      cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
    },
    failed: {
      icon: AlertCircle,
      cls: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
    }
  };

const SYSTEM_SERVICES = [
  { key: 'database', label: '数据库', icon: Database },
  { key: 'redis', label: 'Redis 缓存', icon: Server }
] as const;

const TaskStatus = ({ stats, loading }: Props) => (
  <div className='rounded-md border bg-card p-5 flex flex-col gap-4'>
    <div className='flex items-center gap-2'>
      <Server className='size-4 text-primary' />
      <span className='font-medium text-sm'>转码任务状态</span>
    </div>
    {loading ? (
      <div className='flex flex-wrap gap-2'>
        {Array.from({ length: Object.keys(taskStatusMap).length }).map(
          (_, i) => (
            <Skeleton
              key={i}
              className='h-8 w-24'
            />
          )
        )}
      </div>
    ) : (
      <div className='flex flex-wrap gap-3'>
        {Object.entries(taskStatusMap).map(([key, { label }]) => {
          const ui = TASK_STATUS_UI[key];
          const Icon = ui.icon;
          return (
            <div
              key={key}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                ui.cls
              )}
            >
              <Icon className='size-3.5' />
              <span>{label}</span>
              <span className='font-bold'>
                {stats?.tasks[key as keyof typeof stats.tasks] ?? 0}
              </span>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const SystemStatus = ({ stats, loading }: Props) => (
  <div className='rounded-md border bg-card p-5 flex flex-col gap-4'>
    <div className='flex items-center gap-2'>
      <Shield className='size-4 text-primary' />
      <span className='font-medium text-sm'>系统状态</span>
    </div>
    {loading ? (
      <div className='flex flex-col gap-3'>
        {Array.from({ length: SYSTEM_SERVICES.length }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-10 w-full'
          />
        ))}
      </div>
    ) : (
      <div className='flex flex-col gap-3'>
        {SYSTEM_SERVICES.map(({ key, label, icon: Icon }) => {
          const sys = stats?.system[key];
          return (
            <div
              key={key}
              className='flex items-center justify-between rounded-md border bg-muted/30 px-4 py-2.5'
            >
              <div className='flex items-center gap-2 text-sm'>
                <Icon className='size-4' />
                <span>{label}</span>
              </div>
              <div className='flex items-center gap-3'>
                {sys?.latency !== undefined && (
                  <span className='text-xs'>{sys.latency}ms</span>
                )}
                <StatusDot status={sys?.status ?? 'error'} />
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const TaskSystemStatus = ({ stats, loading }: Props) => (
  <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
    <TaskStatus
      stats={stats}
      loading={loading}
    />
    <SystemStatus
      stats={stats}
      loading={loading}
    />
  </div>
);

export default TaskSystemStatus;
