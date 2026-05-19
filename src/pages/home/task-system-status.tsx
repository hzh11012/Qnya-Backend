import type { DashboardStatsResponse } from '@/apis';
import { CheckCircle2, Circle, Database, Server, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusDot } from './components';

interface Props {
  stats: DashboardStatsResponse | undefined;
  loading: boolean;
}

const TASK_STATUS_UI = [
  {
    key: 'pending' as const,
    label: '待处理',
    icon: Circle,
    cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
  },
  {
    key: 'completed' as const,
    label: '已完成',
    icon: CheckCircle2,
    cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
  }
];

const SYSTEM_SERVICES = [
  { key: 'database', label: '数据库', icon: Database },
  { key: 'redis', label: 'Redis 缓存', icon: Server }
] as const;

const TaskStatus = ({ stats, loading }: Props) => (
  <div className='rounded-md border bg-card p-5 flex flex-col gap-4'>
    <div className='flex items-center gap-2'>
      <Server className='size-4 text-primary' />
      <span className='font-medium text-sm'>任务状态</span>
    </div>
    {loading ? (
      <div className='flex flex-wrap gap-2'>
        {Array.from({ length: TASK_STATUS_UI.length }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-8 w-24'
          />
        ))}
      </div>
    ) : (
      <div className='flex flex-wrap gap-3'>
        {TASK_STATUS_UI.map(({ key, label, icon: Icon, cls }) => (
          <div
            key={key}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
              cls
            )}
          >
            <Icon className='size-3.5' />
            <span>{label}</span>
            <span className='font-bold'>{stats?.tasks[key] ?? 0}</span>
          </div>
        ))}
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
