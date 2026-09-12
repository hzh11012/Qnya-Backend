import { cn } from '@/lib/utils';

/** 概览卡片基底：呼应登录页的毛玻璃卡片质感（概览 / MCP / 系统信息共用） */
export const CARD_BASE =
  'rounded-xl border border-border/60 bg-card/60 backdrop-blur-md';

export const OverviewCard = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn(CARD_BASE, 'flex flex-col gap-4 p-5', className)}>
    {children}
  </div>
);

/** 卡片标题：主色图标 + 大写字距标签（呼应登录页 Sign in） */
export const CardTitle = ({
  icon: Icon,
  children,
  badge
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) => (
  <div className='flex items-center gap-2.5'>
    <Icon className='size-3.5 shrink-0 text-primary' />
    <span className='font-display text-[11px] font-medium uppercase tracking-[0.25em] text-muted'>
      {children}
    </span>
    {badge}
  </div>
);

/** 分区标题：渐变短线 + 大写字距标签 + 中文标题（复刻登录页标题节奏） */
export const SectionHeader = ({
  label,
  title,
  children
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) => (
  <div className='animate-fade-up flex flex-wrap items-end justify-between gap-3'>
    <div>
      <div className='flex items-center gap-3'>
        <div
          aria-hidden
          className='h-px w-10 bg-linear-to-r from-primary/60 to-transparent'
        />
        <span className='font-display text-[11px] font-medium uppercase tracking-[0.3em] text-muted'>
          {label}
        </span>
      </div>
      <h2 className='font-display mt-1.5 text-base font-semibold tracking-tight'>
        {title}
      </h2>
    </div>
    {children}
  </div>
);
