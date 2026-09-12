import type { ReactNode } from 'react';

/**
 * 列表页 hero 头部：网格背景 + 渐变短线 + 大写字距标签
 * 与概览 / MCP / 系统信息页保持同一节奏，各列表页共用
 */
const ListPageHeader = ({
  label,
  title,
  description
}: {
  label: string;
  title: string;
  description?: ReactNode;
}) => (
  <header className='animate-fade-up relative shrink-0 overflow-hidden rounded-xl border border-border/60 bg-card/40 backdrop-blur-md'>
    <div
      aria-hidden
      className='pointer-events-none absolute inset-0 bg-grid opacity-50'
    />
    <div className='relative p-6'>
      <div className='flex items-center gap-3'>
        <div
          aria-hidden
          className='h-px w-10 bg-linear-to-r from-primary/60 to-transparent'
        />
        <span className='font-display text-[11px] font-medium uppercase tracking-[0.3em] text-muted'>
          {label}
        </span>
      </div>
      <h1 className='font-display mt-2 font-semibold text-2xl tracking-tight'>
        {title}
      </h1>
      {description && <p className='mt-1 text-sm text-muted'>{description}</p>}
    </div>
  </header>
);

export default ListPageHeader;
