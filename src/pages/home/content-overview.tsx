import type { DashboardStatsResponse } from '@/apis';
import {
  Activity,
  BookOpen,
  Clapperboard,
  Film,
  Layers,
  MessageSquare,
  Users
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { MiniBar, SkeletonCard, StatCard } from './components';
import {
  status as animeStatus,
  types as animeTypes
} from '@/pages/anime/columns';
import { roles } from '@/pages/users/columns';

interface Props {
  stats: DashboardStatsResponse | undefined;
  loading: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-orange-500',
  upcoming: 'bg-blue-500',
  airing: 'bg-emerald-500',
  completed: 'bg-purple-500'
};

const TYPE_COLORS: Record<string, string> = {
  japanese: 'bg-pink-500',
  chinese: 'bg-red-500',
  american: 'bg-blue-500',
  movie: 'bg-amber-500',
  adult: 'bg-violet-500'
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-500',
  premium: 'bg-amber-500',
  user: 'bg-blue-500',
  guest: 'bg-teal-500'
};

const AnimeStatusChart = ({ stats, loading }: Props) => (
  <div className='rounded-md border bg-card p-5 flex flex-col gap-4'>
    <div className='flex items-center gap-2'>
      <Activity className='size-4 text-primary' />
      <span className='font-medium text-sm'>番剧状态分布</span>
    </div>
    {loading ? (
      <div className='flex flex-col gap-3'>
        {Array.from({ length: animeStatus.length }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-5 w-full'
          />
        ))}
      </div>
    ) : (
      <div className='flex flex-col gap-3'>
        {animeStatus.map(({ value, label }) => {
          const val =
            stats?.content.animeByStatus[
              value as keyof typeof stats.content.animeByStatus
            ] ?? 0;
          const total = stats?.content.animeTotal ?? 1;
          return (
            <div
              key={value}
              className='flex items-center gap-2'
            >
              <span className='w-16 shrink-0 text-xs'>{label}</span>
              <MiniBar
                value={val}
                max={total}
                color={STATUS_COLORS[value] ?? 'bg-primary'}
              />
              <span className='w-8 text-right text-xs font-medium'>{val}</span>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const AnimeTypeChart = ({ stats, loading }: Props) => (
  <div className='rounded-md border bg-card p-5 flex flex-col gap-4'>
    <div className='flex items-center gap-2'>
      <Film className='size-4 text-primary' />
      <span className='font-medium text-sm'>番剧类型分布</span>
    </div>
    {loading ? (
      <div className='flex flex-col gap-3'>
        {Array.from({ length: animeTypes.length }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-5 w-full'
          />
        ))}
      </div>
    ) : (
      <div className='flex flex-col gap-3'>
        {animeTypes.map(({ value, label }) => {
          const val =
            stats?.content.animeByType[
              value as keyof typeof stats.content.animeByType
            ] ?? 0;
          const total = stats?.content.animeTotal ?? 1;
          return (
            <div
              key={value}
              className='flex items-center gap-2'
            >
              <span className='w-16 shrink-0 text-xs'>{label}</span>
              <MiniBar
                value={val}
                max={total}
                color={TYPE_COLORS[value] ?? 'bg-primary'}
              />
              <span className='w-8 text-right text-xs font-medium'>{val}</span>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const UserRoleChart = ({ stats, loading }: Props) => (
  <div className='rounded-md border bg-card p-5 flex flex-col gap-4'>
    <div className='flex items-center gap-2'>
      <Users className='size-4 text-primary' />
      <span className='font-medium text-sm'>用户角色分布</span>
    </div>
    {loading ? (
      <div className='flex flex-col gap-3'>
        {Array.from({ length: roles.length }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-5 w-full'
          />
        ))}
      </div>
    ) : (
      <div className='flex flex-col gap-3'>
        {roles.map(({ value, label }) => {
          const val =
            stats?.users.byRole[value as keyof typeof stats.users.byRole] ?? 0;
          const total = stats?.users.total ?? 1;
          return (
            <div
              key={value}
              className='flex items-center gap-2'
            >
              <span className='w-16 shrink-0 text-xs'>{label}</span>
              <MiniBar
                value={val}
                max={total}
                color={ROLE_COLORS[value] ?? 'bg-primary'}
              />
              <span className='w-8 text-right text-xs font-medium'>{val}</span>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const ContentOverview = ({ stats, loading }: Props) => (
  <>
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
      {loading ? (
        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
      ) : (
        <>
          <StatCard
            title='番剧总数'
            value={stats?.content.animeTotal ?? 0}
            icon={Film}
          />
          <StatCard
            title='剧集总数'
            value={stats?.content.videoTotal ?? 0}
            icon={Clapperboard}
          />
          <StatCard
            title='系列总数'
            value={stats?.content.seriesTotal ?? 0}
            icon={Layers}
          />
          <StatCard
            title='专题总数'
            value={stats?.content.topicTotal ?? 0}
            icon={BookOpen}
          />
          <StatCard
            title='用户总数'
            value={stats?.users.total ?? 0}
            icon={Users}
          />
          <StatCard
            title='弹幕总数'
            value={stats?.interaction.danmakuTotal ?? 0}
            icon={MessageSquare}
          />
        </>
      )}
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <AnimeStatusChart
        stats={stats}
        loading={loading}
      />
      <AnimeTypeChart
        stats={stats}
        loading={loading}
      />
      <UserRoleChart
        stats={stats}
        loading={loading}
      />
    </div>
  </>
);

export default ContentOverview;
