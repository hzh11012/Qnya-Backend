import { memo } from 'react';
import { cn } from '@/lib/utils';

export interface ChartSegment {
  label: string;
  value: number;
  /** Tailwind 色类（bg-* / stroke-* 按场景传入） */
  color: string;
}

/** 迷你条：单行占比条 */
export const MiniBar = memo(function MiniBar({
  value,
  max,
  color
}: {
  value: number;
  max: number;
  color: string;
}) {
  return (
    <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-border/60'>
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-500 ease-out',
          color
        )}
        style={{
          width: max > 0 ? `${Math.min((value / max) * 100, 100)}%` : '0%'
        }}
      />
    </div>
  );
});

/** 堆叠比例条：单条多段占比 */
export const StackedBar = memo(function StackedBar({
  segments,
  className
}: {
  segments: ChartSegment[];
  className?: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div
      className={cn(
        'flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-border/60',
        className
      )}
    >
      {total > 0
        ? segments.map(
            ({ label, value, color }) =>
              value > 0 && (
                <div
                  key={label}
                  title={`${label} · ${value}`}
                  className={cn(
                    'h-full transition-[flex-grow] duration-700 first:rounded-l-full last:rounded-r-full',
                    color
                  )}
                  style={{ flexGrow: value }}
                />
              )
          )
        : null}
    </div>
  );
});

/** 环形进度：任务完成率等单一比例 */
export const RingProgress = memo(function RingProgress({
  value,
  size = 108,
  thickness = 9,
  label
}: {
  /** 0-100 */
  value: number;
  size?: number;
  thickness?: number;
  label?: React.ReactNode;
}) {
  const pct = Math.min(Math.max(value, 0), 100);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div
      className='relative shrink-0'
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className='-rotate-90'
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill='none'
          strokeWidth={thickness}
          className='stroke-border/60'
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill='none'
          strokeWidth={thickness}
          strokeLinecap='round'
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          className='stroke-primary transition-[stroke-dasharray] duration-700 ease-out'
        />
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center gap-0.5'>
        <span className='font-display text-xl font-semibold tabular-nums'>
          {pct}%
        </span>
        {label && <span className='text-[10px] text-muted'>{label}</span>}
      </div>
    </div>
  );
});

/** 环形分布图：多段占比 */
export const DonutChart = memo(function DonutChart({
  data,
  size = 140,
  thickness = 16
}: {
  data: ChartSegment[];
  size?: number;
  thickness?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg
      width={size}
      height={size}
      className='-rotate-90 shrink-0'
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill='none'
        strokeWidth={thickness}
        className='stroke-border/60'
      />
      {total > 0
        ? data.map(({ label, value, color: stroke }) => {
            const len = (value / total) * c;
            const el = (
              <circle
                key={label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill='none'
                strokeWidth={thickness}
                strokeDasharray={`${Math.max(len - 2, 0)} ${c}`}
                strokeDashoffset={-offset}
                className={cn(
                  stroke,
                  'transition-[stroke-dasharray] duration-700 ease-out'
                )}
              />
            );
            offset += len;
            return el;
          })
        : null}
    </svg>
  );
});

/** 图例：色点 + 标签 + 数值 */
export const Legend = memo(function Legend({
  items
}: {
  items: ChartSegment[];
}) {
  return (
    <div className='flex flex-col gap-2'>
      {items.map(({ label, value, color }) => (
        <div
          key={label}
          className='flex items-center gap-2 text-xs'
        >
          <span className={cn('size-2 shrink-0 rounded-full', color)} />
          <span className='flex-1'>{label}</span>
          <span className='font-display tabular-nums text-muted'>
            {value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
});
