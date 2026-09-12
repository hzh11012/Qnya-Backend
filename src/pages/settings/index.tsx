import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clearDashboardCache } from '@/apis/settings';
import { Trash2 } from 'lucide-react';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/custom/overview/card';
import { SkeletonInfoCard } from '@/components/custom/overview/skeleton';
import { useSettingsInfo } from './use-settings-info';
import {
  DatabaseCard,
  QbitCard,
  ResourceCard,
  SecurityCard,
  ServerCard,
  SessionCard,
  SmtpCard,
  TmdbCard
} from './cards';
import type { SettingsInfoResponse } from '@/apis/settings';
import type { ComponentType } from 'react';

/** 配置卡注册表：顺序即展示顺序 */
const CARDS: {
  key: keyof SettingsInfoResponse;
  Component: ComponentType<{ data: never }>;
}[] = [
  { key: 'server', Component: ServerCard },
  { key: 'qbit', Component: QbitCard },
  { key: 'smtp', Component: SmtpCard },
  { key: 'database', Component: DatabaseCard },
  { key: 'session', Component: SessionCard },
  { key: 'security', Component: SecurityCard },
  { key: 'resource', Component: ResourceCard },
  { key: 'tmdb', Component: TmdbCard }
];

const SKELETON_ROWS = [5, 3, 4, 3, 3, 2, 1, 2];

const Settings = () => {
  const queryClient = useQueryClient();
  const { data, isPending: loading, showSkeleton, refetch } = useSettingsInfo();

  // 清除后端仪表盘缓存后，同步失效前端的 dashboard 缓存
  const clearCache = useMutation({
    mutationFn: clearDashboardCache,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  return (
    <div className='flex flex-col gap-6'>
      {/* 页头：与概览页同一节奏 */}
      <header className='animate-fade-up relative overflow-hidden rounded-xl border border-border/60 bg-card/40 backdrop-blur-md'>
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 bg-grid opacity-50'
        />
        <div className='relative flex flex-wrap items-end justify-between gap-4 p-6'>
          <div>
            <div className='flex items-center gap-3'>
              <div
                aria-hidden
                className='h-px w-10 bg-linear-to-r from-primary/60 to-transparent'
              />
              <span className='font-display text-[11px] font-medium uppercase tracking-[0.3em] text-muted'>
                Settings
              </span>
            </div>
            <h1 className='font-display mt-2 font-semibold text-2xl tracking-tight'>
              系统信息
            </h1>
            <p className='mt-1 text-sm text-muted'>
              服务器、外部服务连接与安全配置一览
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              disabled={clearCache.isPending}
              onClick={() => clearCache.mutate()}
              className='gap-1.5'
            >
              <Trash2 className='size-3.5' />
              清除仪表盘缓存
            </Button>
            <DataTableRefresh
              onRefresh={() => refetch()}
              disabled={loading}
            />
          </div>
        </div>
      </header>

      <section className='flex flex-col gap-4'>
        <SectionHeader
          label='Configuration'
          title='配置总览'
        />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {showSkeleton
            ? SKELETON_ROWS.map((rows, i) => (
                <div
                  key={i}
                  className='animate-fade-up'
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <SkeletonInfoCard
                    rows={rows}
                    className='h-full'
                  />
                </div>
              ))
            : CARDS.map(({ key, Component }, i) => {
                const value = data?.[key];
                return value === undefined ? null : (
                  <div
                    key={key}
                    className='animate-fade-up'
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Component data={value as never} />
                  </div>
                );
              })}
        </div>
      </section>
    </div>
  );
};

export default Settings;
