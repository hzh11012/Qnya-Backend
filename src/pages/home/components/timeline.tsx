import { cn } from '@/lib/utils';

/** 垂直时间轴容器：左侧贯穿线 */
export const Timeline = ({ children }: { children: React.ReactNode }) => (
  <div className='relative flex flex-col gap-4 before:absolute before:inset-y-1 before:left-[3px] before:w-px before:bg-border'>
    {children}
  </div>
);

/** 时间轴节点：彩色圆点 + 内容 */
export const TimelineItem = ({
  dot,
  children
}: {
  /** Tailwind 色类，如 'bg-blue-500/70 ring-blue-500/10' */
  dot?: string;
  children: React.ReactNode;
}) => (
  <div className='relative pl-5'>
    <span
      className={cn(
        'absolute top-1.5 left-0 size-1.5 rounded-full ring-4 ring-primary/10',
        dot ?? 'bg-primary/70'
      )}
    />
    {children}
  </div>
);
