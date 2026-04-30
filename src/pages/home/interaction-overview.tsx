import type { DashboardStatsResponse } from '@/apis';
import { Clock, Flame, MessageSquare, Star } from 'lucide-react';
import { SkeletonCard, StatCard } from './components';

interface Props {
  stats: DashboardStatsResponse | undefined;
  loading: boolean;
}

const InteractionOverview = ({ stats, loading }: Props) => (
  <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
    {loading ? (
      Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
    ) : (
      <>
        <StatCard
          title='观看记录'
          value={stats?.interaction.historyTotal ?? 0}
          icon={Clock}
        />
        <StatCard
          title='追番总数'
          value={stats?.interaction.collectionTotal ?? 0}
          icon={Flame}
        />
        <StatCard
          title='评分总数'
          value={stats?.interaction.scoreTotal ?? 0}
          icon={Star}
        />
        <StatCard
          title='弹幕总数'
          value={stats?.interaction.danmakuTotal ?? 0}
          icon={MessageSquare}
        />
      </>
    )}
  </div>
);

export default InteractionOverview;
