import { useRecommendInfo } from './use-recommend-info';
import RefreshAffinityButton from './refresh-button';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { SectionHeader } from '@/components/custom/overview/card';
import { InfoRow } from '@/components/custom/overview/info-row';
import { SkeletonInfoCard } from '@/components/custom/overview/skeleton';
import { OverviewCard, CardTitle } from '@/components/custom/overview/card';
import { formatDate } from '@/lib/utils';
import { CalendarClock, Compass, HeartHandshake, Users } from 'lucide-react';

/** 推荐系统：「猜你喜欢」排序 = 标签画像 + 协同过滤共现 + 热门度兜底 + 稳定随机 */
const Recommend = () => {
  const {
    data,
    isPending: loading,
    showSkeleton,
    refetch
  } = useRecommendInfo();

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
                Recommend
              </span>
            </div>
            <h1 className='font-display mt-2 font-semibold text-2xl tracking-tight'>
              猜你喜欢
            </h1>
            <p className='mt-1 text-sm text-muted'>
              推荐系统状态与共现矩阵维护
            </p>
          </div>
          <DataTableRefresh
            onRefresh={() => refetch()}
            disabled={loading}
          />
        </div>
      </header>

      {showSkeleton ? (
        <SkeletonInfoCard rows={4} />
      ) : data ? (
        <section className='flex flex-col gap-4'>
          <SectionHeader
            label='Status'
            title='运行状态'
          >
            <RefreshAffinityButton />
          </SectionHeader>
          <div className='animate-fade-up'>
            <OverviewCard>
              <CardTitle icon={Compass}>共现矩阵</CardTitle>
              <div className='flex flex-col'>
                <InfoRow
                  icon={CalendarClock}
                  label='最近重建时间'
                  value={
                    data.lastRefreshedAt
                      ? formatDate(data.lastRefreshedAt)
                      : '从未重建（首次启动后自动执行）'
                  }
                  highlight={data.lastRefreshedAt ? 'success' : 'warning'}
                />
                <InfoRow
                  icon={HeartHandshake}
                  label='亲和记录条数'
                  value={data.affinityCount.toLocaleString()}
                />
                <InfoRow
                  icon={Users}
                  label='可推荐番剧数'
                  value={data.animeCount.toLocaleString()}
                />
              </div>
            </OverviewCard>
          </div>

          <section className='flex flex-col gap-4'>
            <SectionHeader
              label='How it works'
              title='排序说明'
            />
            <div className='animate-fade-up'>
              <OverviewCard>
                <div className='flex flex-col gap-2 text-sm text-muted'>
                  <p>
                    客户端「猜你喜欢」按
                    <span className='mx-1 font-mono text-foreground'>
                      兴趣分 → 评分人数 → 均分 → 稳定随机
                    </span>
                    排序。
                  </p>
                  <p>
                    兴趣分 = 标签画像分（用户观看/追番/评分过的番剧标签加权）+
                    协同过滤分（看过相同番剧的用户还在看什么，来自共现矩阵）。
                  </p>
                  <p>
                    未登录用户与互动较少的用户自动退化为「热门优先 + 随机」；
                    共现矩阵每 6 小时自动重建一次，无需日常干预。
                  </p>
                </div>
              </OverviewCard>
            </div>
          </section>
        </section>
      ) : null}
    </div>
  );
};

export default Recommend;
