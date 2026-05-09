import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export const Card = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'rounded-md border bg-card p-5 flex flex-col gap-3',
      className
    )}
  >
    {children}
  </div>
);

export const SectionTitle = ({
  icon: Icon,
  title,
  badge
}: {
  icon: React.ElementType;
  title: string;
  badge?: React.ReactNode;
}) => (
  <div className='flex items-center gap-2 pb-1'>
    <Icon className='size-4 text-primary shrink-0' />
    <span className='font-semibold text-sm'>{title}</span>
    {badge}
  </div>
);

export const InfoRow = ({
  label,
  value,
  icon: Icon,
  highlight
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  highlight?: 'success' | 'warning' | 'danger';
}) => {
  const highlightCls = {
    success: 'text-emerald-600 dark:text-emerald-400 font-medium',
    warning: 'text-yellow-600 dark:text-yellow-400 font-medium',
    danger: 'text-destructive font-medium'
  };

  return (
    <div className='flex items-center justify-between py-2 border-b last:border-0 border-border/50'>
      <div className='flex items-center gap-2 text-sm'>
        {Icon && <Icon className='size-3.5 shrink-0' />}
        <span>{label}</span>
      </div>
      <span
        className={cn(
          'text-sm font-mono',
          highlight ? highlightCls[highlight] : 'text-foreground'
        )}
      >
        {value}
      </span>
    </div>
  );
};

export const SkeletonCard = ({ rows = 3 }: { rows?: number }) => (
  <Card>
    <div className='flex items-center gap-2 pb-1'>
      <Skeleton className='size-4 rounded' />
      <Skeleton className='h-4 w-28' />
    </div>
    <div className='flex flex-col gap-3'>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className='flex items-center justify-between py-2 border-b last:border-0 border-border/50'
        >
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-32' />
        </div>
      ))}
    </div>
  </Card>
);

export const ActiveBadge = ({ count }: { count: number }) => (
  <span
    className={cn(
      'ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      count > 0
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : 'bg-muted'
    )}
  >
    {count > 0 ? `${count} 活跃` : '空闲'}
  </span>
);
