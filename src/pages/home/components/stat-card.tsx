import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { CARD_BASE } from '@/components/custom/overview/card';
import { useCountUp } from '@/hooks/use-count-up';

/** KPI 数字卡：count-up 滚动数字 + 图标色块 */
export const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  accent,
  hint,
  delay = 0
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  accent?: string;
  hint?: React.ReactNode;
  delay?: number;
}) {
  const isNumber = typeof value === 'number';
  const display = useCountUp(isNumber ? value : 0);

  return (
    <div
      className={cn(CARD_BASE, 'animate-fade-up flex flex-col gap-4 p-5')}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className='flex items-center justify-between'>
        <span className='font-display text-[10px] font-medium uppercase tracking-[0.2em] text-muted'>
          {title}
        </span>
        <span
          className={cn(
            'flex size-8 items-center justify-center rounded-lg',
            accent ?? 'bg-primary/10'
          )}
        >
          <Icon
            className={cn('size-4', accent ? 'text-white' : 'text-primary')}
          />
        </span>
      </div>
      <div className='font-display text-3xl font-semibold tracking-tight tabular-nums'>
        {(isNumber ? display : value).toLocaleString()}
      </div>
      {hint && (
        <div className='font-display mt-auto text-xs text-muted'>{hint}</div>
      )}
    </div>
  );
});

/** KPI 卡骨架 */
export const SkeletonCard = () => (
  <div
    aria-hidden
    className={cn(CARD_BASE, 'flex flex-col gap-4 p-5')}
  >
    <div className='flex items-center justify-between'>
      <Skeleton className='h-3.5 w-16' />
      <Skeleton className='size-8 rounded-lg' />
    </div>
    <Skeleton className='h-9 w-24' />
  </div>
);
