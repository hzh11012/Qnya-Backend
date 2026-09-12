import type { OverviewSectionProps } from '@/pages/home/types';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/custom/overview/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Flame, MessageSquare, Star } from 'lucide-react';

type InteractionKey =
  | 'historyTotal'
  | 'collectionTotal'
  | 'scoreTotal'
  | 'danmakuTotal';

interface InteractionItem {
  key: InteractionKey;
  label: string;
  icon: React.ElementType;
  /** 图标色块样式 */
  cls: string;
}

/** 模块级常量：避免每次渲染重建（rendering-hoist-jsx） */
const INTERACTION_ITEMS: InteractionItem[] = [
  {
    key: 'historyTotal',
    label: '观看记录',
    icon: Clock,
    cls: 'bg-primary/10 text-primary'
  },
  {
    key: 'collectionTotal',
    label: '追番总数',
    icon: Flame,
    cls: 'bg-orange-500/10 text-orange-500'
  },
  {
    key: 'scoreTotal',
    label: '评分总数',
    icon: Star,
    cls: 'bg-yellow-500/10 text-yellow-500'
  },
  {
    key: 'danmakuTotal',
    label: '弹幕总数',
    icon: MessageSquare,
    cls: 'bg-blue-500/10 text-blue-500'
  }
];

/** 互动数据：单张四格分割条（移动端 2×2，桌面端 4 列） */
const InteractionOverview = ({ stats, loading }: OverviewSectionProps) => (
  <section className='flex flex-col gap-4'>
    <SectionHeader
      label='Interaction'
      title='互动数据'
    />
    <div className='animate-fade-up grid grid-cols-2 overflow-hidden rounded-xl border border-border/60 bg-card/60 backdrop-blur-md md:grid-cols-4 md:divide-x md:divide-border/60'>
      {loading
        ? INTERACTION_ITEMS.map(({ key }, i) => (
            <div
              key={key}
              className={cn(
                'flex flex-col gap-3 p-5',
                i % 2 === 0 && 'border-r border-border/60 md:border-r-0',
                i < 2 && 'border-b border-border/60 md:border-b-0'
              )}
            >
              <Skeleton className='size-8 rounded-lg' />
              <Skeleton className='h-9 w-24' />
            </div>
          ))
        : INTERACTION_ITEMS.map(({ key, label, icon: Icon, cls }, i) => {
            const value = stats?.interaction[key] ?? 0;
            return (
              <div
                key={key}
                className={cn(
                  'flex flex-col gap-3 p-5 transition-colors hover:bg-background/40',
                  i % 2 === 0 && 'border-r border-border/60 md:border-r-0',
                  i < 2 && 'border-b border-border/60 md:border-b-0'
                )}
              >
                <div className='flex items-center justify-between'>
                  <span className='font-display text-[10px] font-medium uppercase tracking-[0.2em] text-muted'>
                    {label}
                  </span>
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg',
                      cls
                    )}
                  >
                    <Icon className='size-4' />
                  </span>
                </div>
                <div className='font-display text-3xl font-semibold tracking-tight tabular-nums'>
                  {value.toLocaleString()}
                </div>
              </div>
            );
          })}
    </div>
  </section>
);

export default InteractionOverview;
