import type { DashboardStatsResponse } from '@/apis';
import { Flame, MessageSquare, Star } from 'lucide-react';
import { cn, createMap, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SectionTitle } from './components';
import { typeOptions } from '@/pages/feedbacks/columns';

interface Props {
  stats: DashboardStatsResponse | undefined;
  loading: boolean;
}

const feedbackTypeMap = createMap(typeOptions);

const TopCollections = ({ stats, loading }: Props) => (
  <div className='rounded-md border bg-card p-5 flex flex-col gap-4'>
    <div className='flex items-center gap-2'>
      <Flame className='size-4 text-orange-500' />
      <span className='font-medium text-sm'>追番排行 Top 10</span>
    </div>
    {loading ? (
      <div className='flex flex-col gap-3'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='flex items-center gap-3'
          >
            <Skeleton className='size-8 rounded-md' />
            <Skeleton className='h-4 flex-1' />
            <Skeleton className='h-4 w-10' />
          </div>
        ))}
      </div>
    ) : (
      <div className='flex flex-col gap-2'>
        {(stats?.topCollections ?? []).slice(0, 10).map((item, idx) => (
          <div
            key={item.animeId}
            className='flex items-center gap-3'
          >
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded text-xs font-bold',
                idx === 0 &&
                  'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
                idx === 1 &&
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                idx === 2 &&
                  'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400',
                idx > 2 && 'bg-muted text-muted-foreground'
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
            <span className='flex-1 text-xs truncate'>{item.animeName}</span>
            <span className='text-xs font-semibold text-muted-foreground'>
              {item.count}
            </span>
          </div>
        ))}
        {(stats?.topCollections ?? []).length === 0 && (
          <p className='text-xs text-muted-foreground text-center py-4'>
            暂无数据
          </p>
        )}
      </div>
    )}
  </div>
);

const RecentFeedbacks = ({ stats, loading }: Props) => (
  <div className='rounded-md border bg-card p-5 flex flex-col gap-4'>
    <div className='flex items-center gap-2'>
      <MessageSquare className='size-4 text-blue-500' />
      <span className='font-medium text-sm'>最新待处理反馈</span>
    </div>
    {loading ? (
      <div className='flex flex-col gap-3'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='flex flex-col gap-1.5'
          >
            <Skeleton className='h-3.5 w-3/4' />
            <Skeleton className='h-3 w-full' />
          </div>
        ))}
      </div>
    ) : (
      <div className='flex flex-col gap-3 overflow-hidden'>
        {(stats?.recentFeedbacks ?? []).slice(0, 10).map(item => (
          <div
            key={item.id}
            className='flex flex-col gap-1 border-b border-border/60 pb-3 last:border-0 last:pb-0'
          >
            <div className='flex items-center gap-2'>
              <Badge
                variant='muted'
                className='text-[10px] px-1.5 py-0 h-4'
              >
                {feedbackTypeMap[item.type] ?? item.type}
              </Badge>
              <span className='text-xs font-medium truncate flex-1'>
                {item.animeName}
              </span>
            </div>
            <p className='text-xs text-muted-foreground line-clamp-1'>
              {item.content}
            </p>
            <p className='text-[10px] text-muted-foreground/70'>
              {formatDate(item.createdAt)}
            </p>
          </div>
        ))}
        {(stats?.recentFeedbacks ?? []).length === 0 && (
          <p className='text-xs text-muted-foreground text-center py-4'>
            暂无待处理反馈
          </p>
        )}
      </div>
    )}
  </div>
);

const RecentScores = ({ stats, loading }: Props) => (
  <div className='rounded-md border bg-card p-5 flex flex-col gap-4'>
    <div className='flex items-center gap-2'>
      <Star className='size-4 text-yellow-500' />
      <span className='font-medium text-sm'>最新评分</span>
    </div>
    {loading ? (
      <div className='flex flex-col gap-3'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='flex flex-col gap-1.5'
          >
            <Skeleton className='h-3.5 w-3/4' />
            <Skeleton className='h-3 w-full' />
          </div>
        ))}
      </div>
    ) : (
      <div className='flex flex-col gap-3'>
        {(stats?.recentScores ?? []).slice(0, 10).map(item => (
          <div
            key={item.id}
            className='flex flex-col gap-1 border-b border-border/60 pb-3 last:border-0 last:pb-0'
          >
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-0.5'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'size-3',
                      i < Math.round(item.score / 2)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/40'
                    )}
                  />
                ))}
              </div>
              <span className='text-[10px] text-muted-foreground'>
                {item.score}
              </span>
            </div>
            <span className='text-xs font-medium truncate'>
              {item.animeName}
            </span>
            <div className='flex items-center justify-between'>
              <p className='text-xs text-muted-foreground line-clamp-1 flex-1'>
                {item.content || '—'}
              </p>
              <span className='text-[10px] text-muted-foreground/70 shrink-0 ml-2'>
                {item.userName}
              </span>
            </div>
          </div>
        ))}
        {(stats?.recentScores ?? []).length === 0 && (
          <p className='text-xs text-muted-foreground text-center py-4'>
            暂无评分数据
          </p>
        )}
      </div>
    )}
  </div>
);

const OperationData = ({ stats, loading }: Props) => (
  <div className='flex flex-col gap-3'>
    <SectionTitle>运营数据</SectionTitle>
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
      <TopCollections
        stats={stats}
        loading={loading}
      />
      <RecentFeedbacks
        stats={stats}
        loading={loading}
      />
      <RecentScores
        stats={stats}
        loading={loading}
      />
    </div>
  </div>
);

export default OperationData;
