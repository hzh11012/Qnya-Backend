import type { OverviewSectionProps } from '@/pages/home/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CardTitle,
  OverviewCard,
  SectionHeader,
  SkeletonCard
} from '@/pages/home/components/card';
import { StatCard } from '@/pages/home/components/stat-card';
import {
  DonutChart,
  Legend,
  MiniBar,
  StackedBar
} from '@/pages/home/components/charts';
import {
  ROLE_DOTS,
  ROLE_STROKES,
  STATUS_COLORS,
  TYPE_COLORS
} from '@/pages/home/constants';
import {
  status as animeStatus,
  types as animeTypes
} from '@/pages/anime/columns';
import { roles } from '@/pages/users/columns';
import {
  Activity,
  BookOpen,
  Clapperboard,
  Film,
  Layers,
  MessageSquare,
  Users
} from 'lucide-react';

type Stats = OverviewSectionProps['stats'];
type AnimeStatusKey = keyof NonNullable<Stats>['content']['animeByStatus'];
type AnimeTypeKey = keyof NonNullable<Stats>['content']['animeByType'];
type UserRoleKey = keyof NonNullable<Stats>['users']['byRole'];

interface KpiItem {
  key: string;
  title: string;
  icon: React.ElementType;
  delay: number;
  getValue: (stats: Stats) => number;
  hint?: (stats: Stats) => React.ReactNode;
}

/** KPI 配置：模块级常量，避免每次渲染重建（rendering-hoist-jsx） */
const KPI_ITEMS: KpiItem[] = [
  {
    key: 'anime',
    title: '番剧总数',
    icon: Film,
    delay: 0,
    getValue: s => s?.content.animeTotal ?? 0
  },
  {
    key: 'video',
    title: '剧集总数',
    icon: Clapperboard,
    delay: 60,
    getValue: s => s?.content.videoTotal ?? 0
  },
  {
    key: 'series',
    title: '系列总数',
    icon: Layers,
    delay: 120,
    getValue: s => s?.content.seriesTotal ?? 0
  },
  {
    key: 'topic',
    title: '专题总数',
    icon: BookOpen,
    delay: 180,
    getValue: s => s?.content.topicTotal ?? 0
  },
  {
    key: 'users',
    title: '用户总数',
    icon: Users,
    delay: 240,
    getValue: s => s?.users.total ?? 0,
    hint: s => `活跃 ${s?.users.active ?? 0}`
  },
  {
    key: 'danmaku',
    title: '弹幕总数',
    icon: MessageSquare,
    delay: 300,
    getValue: s => s?.interaction.danmakuTotal ?? 0
  }
];

const statusColor = (key: string) =>
  STATUS_COLORS[key as keyof typeof STATUS_COLORS] ?? 'bg-primary';
const typeColor = (key: string) =>
  TYPE_COLORS[key as keyof typeof TYPE_COLORS] ?? 'bg-primary';

/** 番剧状态：单条堆叠比例条 + 图例 */
const StatusStackCard = ({ stats, loading }: OverviewSectionProps) => {
  const total = stats?.content.animeTotal ?? 0;
  const segments = animeStatus.map(({ value, label }) => ({
    label,
    value: stats?.content.animeByStatus[value as AnimeStatusKey] ?? 0,
    color: statusColor(value)
  }));

  return (
    <OverviewCard className='h-full'>
      <CardTitle icon={Activity}>番剧状态分布</CardTitle>
      {loading ? (
        <div className='flex flex-1 flex-col gap-4'>
          <Skeleton className='h-2.5 w-full rounded-full' />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className='h-4 w-full'
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-1 flex-col justify-between'>
          <div className='flex items-baseline justify-between'>
            <span className='font-display text-2xl font-semibold tabular-nums'>
              {total.toLocaleString()}
            </span>
            <span className='font-display text-[10px] uppercase tracking-[0.2em] text-muted'>
              anime
            </span>
          </div>
          <StackedBar segments={segments} />
          <Legend items={segments} />
        </div>
      )}
    </OverviewCard>
  );
};

/** 番剧类型：横向条形列表 + 百分比 */
const TypeBarCard = ({ stats, loading }: OverviewSectionProps) => {
  const total = stats?.content.animeTotal ?? 0;
  const rows = animeTypes.map(({ value, label }) => {
    const val = stats?.content.animeByType[value as AnimeTypeKey] ?? 0;
    return {
      value,
      label,
      val,
      pct: total > 0 ? Math.round((val / total) * 100) : 0
    };
  });
  const max = Math.max(...rows.map(r => r.val), 1);

  return (
    <OverviewCard className='h-full'>
      <CardTitle icon={Film}>番剧类型分布</CardTitle>
      {loading ? (
        <div className='flex flex-1 flex-col justify-center gap-3'>
          {Array.from({ length: animeTypes.length }).map((_, i) => (
            <Skeleton
              key={i}
              className='h-5 w-full'
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-1 flex-col justify-center gap-3.5'>
          {rows.map(({ value, label, val, pct }) => (
            <div
              key={value}
              className='flex items-center gap-2'
            >
              <span className='w-16 shrink-0 text-xs'>{label}</span>
              <MiniBar
                value={val}
                max={max}
                color={typeColor(value)}
              />
              <span className='font-display w-14 shrink-0 text-right text-xs tabular-nums text-muted'>
                {val} · {pct}%
              </span>
            </div>
          ))}
        </div>
      )}
    </OverviewCard>
  );
};

/** 用户角色：环形图 + 中心总数 + 图例 */
const RoleDonutCard = ({ stats, loading }: OverviewSectionProps) => {
  const total = stats?.users.total ?? 0;
  const items = roles.map(({ value, label }) => ({
    value,
    label,
    val: stats?.users.byRole[value as UserRoleKey] ?? 0
  }));

  return (
    <OverviewCard className='h-full'>
      <CardTitle icon={Users}>用户角色分布</CardTitle>
      {loading ? (
        <div className='flex flex-1 items-center gap-5'>
          <Skeleton className='size-32 shrink-0 rounded-full' />
          <div className='flex flex-1 flex-col gap-3'>
            {Array.from({ length: roles.length }).map((_, i) => (
              <Skeleton
                key={i}
                className='h-4 w-full'
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-1 items-center justify-center gap-6'>
          <div className='relative'>
            <DonutChart
              data={items.map(({ value, label, val }) => ({
                label,
                value: val,
                color: ROLE_STROKES[value as keyof typeof ROLE_STROKES]
              }))}
            />
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <span className='font-display text-xl font-semibold tabular-nums'>
                {total.toLocaleString()}
              </span>
              <span className='text-[10px] text-muted'>用户</span>
            </div>
          </div>
          <Legend
            items={items.map(({ value, label, val }) => ({
              label,
              value: val,
              color: ROLE_DOTS[value as keyof typeof ROLE_DOTS]
            }))}
          />
        </div>
      )}
    </OverviewCard>
  );
};

const ContentOverview = ({ stats, loading }: OverviewSectionProps) => (
  <section className='flex flex-col gap-4'>
    <SectionHeader
      label='Content'
      title='内容总览'
    />

    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
      {loading
        ? Array.from({ length: KPI_ITEMS.length }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        : KPI_ITEMS.map(item => (
            <StatCard
              key={item.key}
              title={item.title}
              value={item.getValue(stats)}
              icon={item.icon}
              delay={item.delay}
              hint={item.hint?.(stats)}
            />
          ))}
    </div>

    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <div className='animate-fade-up'>
        <StatusStackCard
          stats={stats}
          loading={loading}
        />
      </div>
      <div className='animate-fade-up [animation-delay:90ms]'>
        <TypeBarCard
          stats={stats}
          loading={loading}
        />
      </div>
      <div className='animate-fade-up [animation-delay:180ms]'>
        <RoleDonutCard
          stats={stats}
          loading={loading}
        />
      </div>
    </div>
  </section>
);

export default ContentOverview;
