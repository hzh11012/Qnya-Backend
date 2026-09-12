import { Skeleton } from '@/components/ui/skeleton';
import { CARD_BASE } from './card';
import { cn } from '@/lib/utils';

/** 信息卡骨架：标题行 + 若干键值行 */
export const SkeletonInfoCard = ({
  rows = 3,
  className
}: {
  rows?: number;
  className?: string;
}) => (
  <div
    aria-hidden
    className={cn(CARD_BASE, 'flex flex-col gap-4 p-5', className)}
  >
    <div className='flex items-center gap-2.5'>
      <Skeleton className='size-3.5 rounded' />
      <Skeleton className='h-3 w-28' />
    </div>
    <div className='flex flex-col'>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className='flex items-center justify-between border-b border-border/50 py-2.5 last:border-0'
        >
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-32' />
        </div>
      ))}
    </div>
  </div>
);
