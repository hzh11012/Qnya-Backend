import type { OverviewSectionProps } from '@/pages/home/types';
import { cn } from '@/lib/utils';
import { OverviewCard, SectionHeader } from '@/pages/home/components/card';
import { RingProgress } from '@/pages/home/components/charts';
import { StatusDot } from '@/pages/home/components/status-dot';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Circle, Database, Server, Shield } from 'lucide-react';

interface TaskBadge {
  key: 'pending' | 'completed';
  label: string;
  icon: React.ElementType;
  cls: string;
}

const TASK_BADGES: TaskBadge[] = [
  {
    key: 'pending',
    label: '待处理',
    icon: Circle,
    cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
  },
  {
    key: 'completed',
    label: '已完成',
    icon: CheckCircle2,
    cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
  }
];

const SYSTEM_SERVICES = [
  { key: 'database', label: '数据库', icon: Database },
  { key: 'redis', label: 'Redis 缓存', icon: Server }
] as const;

/** 任务状态：环形进度 + 计数块 */
const TaskStatus = ({ stats, loading }: OverviewSectionProps) => {
  const pending = stats?.tasks.pending ?? 0;
  const completed = stats?.tasks.completed ?? 0;
  const total = pending + completed;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <OverviewCard className='h-full'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2.5'>
          <Server className='size-3.5 shrink-0 text-primary' />
          <span className='font-display text-[11px] font-medium uppercase tracking-[0.25em] text-muted'>
            任务状态
          </span>
        </div>
        <span className='font-display text-[10px] tabular-nums text-muted'>
          共 {total.toLocaleString()}
        </span>
      </div>
      {loading ? (
        <div className='flex flex-1 items-center gap-5'>
          <Skeleton
            className='shrink-0 rounded-full'
            style={{ width: 108, height: 108 }}
          />
          <div className='flex flex-1 flex-col gap-3'>
            {TASK_BADGES.map(({ key }) => (
              <Skeleton
                key={key}
                className='h-14 rounded-lg'
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-1 items-center gap-5'>
          <RingProgress
            value={pct}
            label='完成率'
          />
          <div className='flex flex-1 flex-col gap-3'>
            {TASK_BADGES.map(({ key, label, icon: Icon, cls }) => (
              <div
                key={key}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3',
                  cls
                )}
              >
                <Icon className='size-4 shrink-0' />
                <span className='flex-1 text-xs font-medium'>{label}</span>
                <span className='font-display text-lg font-semibold tabular-nums'>
                  {(stats?.tasks[key] ?? 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </OverviewCard>
  );
};

/** 系统状态：脉冲点 + 延迟芯片 */
const SystemStatus = ({ stats, loading }: OverviewSectionProps) => (
  <OverviewCard className='h-full'>
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2.5'>
        <Shield className='size-3.5 shrink-0 text-primary' />
        <span className='font-display text-[11px] font-medium uppercase tracking-[0.25em] text-muted'>
          系统状态
        </span>
      </div>
      <span className='font-display text-[10px] uppercase tracking-[0.2em] text-muted'>
        services
      </span>
    </div>
    {loading ? (
      <div className='grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2'>
        {SYSTEM_SERVICES.map(({ key }) => (
          <Skeleton
            key={key}
            className='h-16 w-full rounded-lg'
          />
        ))}
      </div>
    ) : (
      <div className='grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2'>
        {SYSTEM_SERVICES.map(({ key, label, icon: Icon }) => {
          const sys = stats?.system[key];
          return (
            <div
              key={key}
              className='flex flex-col justify-between gap-3 rounded-lg border border-border/60 bg-border/40 px-4 py-3.5'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2.5 text-sm'>
                  <Icon className='size-4 text-muted' />
                  <span>{label}</span>
                </div>
                <StatusDot status={sys?.status ?? 'error'} />
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-display text-[10px] uppercase tracking-[0.2em] text-muted'>
                  latency
                </span>
                <span className='font-display rounded-md bg-background/60 px-1.5 py-0.5 text-xs tabular-nums'>
                  {sys?.latency !== undefined ? `${sys.latency}ms` : '—'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </OverviewCard>
);

const TaskSystemStatus = ({ stats, loading }: OverviewSectionProps) => (
  <section className='flex flex-col gap-4'>
    <SectionHeader
      label='System'
      title='运行状态'
    />
    <div className='grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3'>
      <div className='animate-fade-up'>
        <TaskStatus
          stats={stats}
          loading={loading}
        />
      </div>
      <div className='animate-fade-up [animation-delay:90ms] lg:col-span-2'>
        <SystemStatus
          stats={stats}
          loading={loading}
        />
      </div>
    </div>
  </section>
);

export default TaskSystemStatus;
