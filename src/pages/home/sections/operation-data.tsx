import type { OverviewSectionProps } from '@/pages/home/types';
import {
  CardTitle,
  OverviewCard,
  SectionHeader
} from '@/pages/home/components/card';
import { Timeline, TimelineItem } from '@/pages/home/components/timeline';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, createMap, formatDate } from '@/lib/utils';
import { typeOptions } from '@/pages/feedbacks/columns';
import { Flame, MessageSquare, Star } from 'lucide-react';

const feedbackTypeMap = createMap(typeOptions);

const RANK_CLS = [
  'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'
];

/** 追番排行：带占比条的排行榜 */
const TopCollections = ({ stats, loading }: OverviewSectionProps) => {
  const list = (stats?.topCollections ?? []).slice(0, 10);
  const max = Math.max(...list.map(item => item.count), 1);

  return (
    <OverviewCard className='h-full'>
      <CardTitle icon={Flame}>追番排行 Top 10</CardTitle>
      {loading ? (
        <div className='flex flex-col gap-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className='flex items-center gap-3'
            >
              <Skeleton className='size-7 rounded-md' />
              <Skeleton className='h-4 flex-1' />
              <Skeleton className='h-4 w-10' />
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {list.map((item, idx) => (
            <div
              key={item.animeId}
              className='flex items-center gap-3'
            >
              <span
                className={cn(
                  'font-display flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold',
                  idx < 3 ? RANK_CLS[idx] : 'bg-muted/60 text-muted'
                )}
              >
                {idx + 1}
              </span>
              <Avatar className='size-7 rounded-md'>
                <AvatarImage
                  src={item.cover}
                  className='object-cover'
                />
                <AvatarFallback className='rounded-md text-[10px]'>
                  {item.animeName[0]}
                </AvatarFallback>
              </Avatar>
              <div className='flex min-w-0 flex-1 flex-col gap-1'>
                <span className='truncate text-xs'>{item.animeName}</span>
                <div className='h-1 overflow-hidden rounded-full bg-border/60'>
                  <div
                    className='h-full rounded-full bg-linear-to-r from-primary/60 to-primary transition-[width] duration-500 ease-out'
                    style={{ width: `${(item.count / max) * 100}%` }}
                  />
                </div>
              </div>
              <span className='font-display w-10 shrink-0 text-right text-xs font-semibold tabular-nums'>
                {item.count}
              </span>
            </div>
          ))}
          {list.length === 0 && (
            <p className='py-4 text-center text-xs text-muted'>暂无数据</p>
          )}
        </div>
      )}
    </OverviewCard>
  );
};

/** 最新反馈：时间轴 */
const RecentFeedbacks = ({ stats, loading }: OverviewSectionProps) => (
  <OverviewCard className='h-full'>
    <CardTitle icon={MessageSquare}>最新待处理反馈</CardTitle>
    {loading ? (
      <div className='flex flex-col gap-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='flex flex-col gap-1.5 pl-5'
          >
            <Skeleton className='h-3.5 w-3/4' />
            <Skeleton className='h-3 w-full' />
          </div>
        ))}
      </div>
    ) : (
      <Timeline>
        {(stats?.recentFeedbacks ?? []).slice(0, 10).map(item => (
          <TimelineItem
            key={item.id}
            dot='bg-blue-500/70 ring-blue-500/10'
          >
            <div className='flex items-center gap-2'>
              <Badge
                variant='muted'
                className='h-4 px-1.5 py-0 text-[10px]'
              >
                {feedbackTypeMap[item.type] ?? item.type}
              </Badge>
              <span className='flex-1 truncate text-xs font-medium'>
                {item.animeName}
              </span>
            </div>
            <p className='mt-0.5 line-clamp-1 text-xs text-muted'>
              {item.content}
            </p>
            <p className='font-display mt-0.5 text-[10px] tabular-nums text-muted'>
              {formatDate(item.createdAt)}
            </p>
          </TimelineItem>
        ))}
        {(stats?.recentFeedbacks ?? []).length === 0 && (
          <p className='py-4 text-center text-xs text-muted'>暂无待处理反馈</p>
        )}
      </Timeline>
    )}
  </OverviewCard>
);

/** 最新评分：时间轴 + 星级 */
const RecentScores = ({ stats, loading }: OverviewSectionProps) => (
  <OverviewCard className='h-full'>
    <CardTitle icon={Star}>最新评分</CardTitle>
    {loading ? (
      <div className='flex flex-col gap-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='flex flex-col gap-1.5 pl-5'
          >
            <Skeleton className='h-3.5 w-1/2' />
            <Skeleton className='h-3 w-3/4' />
          </div>
        ))}
      </div>
    ) : (
      <Timeline>
        {(stats?.recentScores ?? []).slice(0, 10).map(item => (
          <TimelineItem
            key={item.id}
            dot='bg-yellow-400/80 ring-yellow-400/10'
          >
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-0.5'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'size-3',
                      i < Math.round(item.score / 2) &&
                        'fill-yellow-400 text-yellow-400'
                    )}
                  />
                ))}
              </div>
              <span className='font-display text-[10px] tabular-nums text-muted'>
                {item.score}
              </span>
              <span className='ml-auto truncate text-xs font-medium'>
                {item.animeName}
              </span>
            </div>
            <p className='mt-0.5 flex items-center justify-between gap-2 text-xs'>
              <span className='line-clamp-1 flex-1 text-muted'>
                {item.content || '—'}
              </span>
              <span className='shrink-0 text-[10px] text-muted'>
                {item.userName}
              </span>
            </p>
          </TimelineItem>
        ))}
        {(stats?.recentScores ?? []).length === 0 && (
          <p className='py-4 text-center text-xs text-muted'>暂无评分数据</p>
        )}
      </Timeline>
    )}
  </OverviewCard>
);

const OperationData = ({ stats, loading }: OverviewSectionProps) => (
  <section className='flex flex-col gap-4'>
    <SectionHeader
      label='Operations'
      title='运营数据'
    />
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
      <div className='animate-fade-up'>
        <TopCollections
          stats={stats}
          loading={loading}
        />
      </div>
      <div className='animate-fade-up [animation-delay:90ms]'>
        <RecentFeedbacks
          stats={stats}
          loading={loading}
        />
      </div>
      <div className='animate-fade-up [animation-delay:180ms]'>
        <RecentScores
          stats={stats}
          loading={loading}
        />
      </div>
    </div>
  </section>
);

export default OperationData;
