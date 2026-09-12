import { memo } from 'react';
import { cn } from '@/lib/utils';

type Highlight = 'success' | 'warning' | 'danger';

const HIGHLIGHT_CLS: Record<Highlight, string> = {
  success:
    'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning:
    'border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  danger: 'border-destructive/40 bg-destructive/10 text-destructive'
};

/** 键值信息行：标签 + 值（值可高亮为状态胶囊） */
export const InfoRow = memo(function InfoRow({
  label,
  value,
  icon: Icon,
  highlight
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  highlight?: Highlight;
}) {
  return (
    <div className='flex items-center justify-between gap-3 border-b border-border/50 py-2.5 transition-colors last:border-0 hover:bg-background/40'>
      <div className='flex items-center gap-2 text-sm'>
        {Icon && <Icon className='size-3.5 shrink-0 text-muted' />}
        <span className='text-muted'>{label}</span>
      </div>
      {highlight ? (
        <span
          className={cn(
            'inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium',
            HIGHLIGHT_CLS[highlight]
          )}
        >
          {value}
        </span>
      ) : (
        <span className='min-w-0 truncate font-mono text-sm tabular-nums'>
          {value}
        </span>
      )}
    </div>
  );
});
