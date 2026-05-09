import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Wifi, WifiOff } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  accent
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  accent?: string;
}) => (
  <div className='rounded-md border bg-card p-5 flex flex-col gap-3'>
    <div className='flex items-center justify-between'>
      <span className='text-sm'>{title}</span>
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-md',
          accent ?? 'bg-primary/10'
        )}
      >
        <Icon
          className={cn('size-4', accent ? 'text-white' : 'text-primary')}
        />
      </span>
    </div>
    <div className='text-3xl font-bold tracking-tight'>
      {value.toLocaleString()}
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className='rounded-md border bg-card p-5 flex flex-col gap-3'>
    <div className='flex items-center justify-between'>
      <Skeleton className='h-4 w-20' />
      <Skeleton className='h-8 w-8 rounded-md' />
    </div>
    <Skeleton className='h-9 w-24' />
  </div>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className='text-sm font-semibold uppercase tracking-wider'>{children}</h2>
);

export const StatusDot = ({ status }: { status: 'ok' | 'error' }) =>
  status === 'ok' ? (
    <span className='flex items-center gap-1.5 text-emerald-500 text-xs font-medium'>
      <Wifi className='size-3.5' />
      正常
    </span>
  ) : (
    <span className='flex items-center gap-1.5 text-destructive text-xs font-medium'>
      <WifiOff className='size-3.5' />
      异常
    </span>
  );

export const MiniBar = ({
  value,
  max,
  color
}: {
  value: number;
  max: number;
  color: string;
}) => (
  <div className='h-1.5 flex-1 rounded-full bg-muted overflow-hidden'>
    <div
      className={cn('h-full rounded-full', color)}
      style={{
        width: max > 0 ? `${Math.min((value / max) * 100, 100)}%` : '0%'
      }}
    />
  </div>
);
