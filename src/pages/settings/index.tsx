import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSettingsInfo, clearDashboardCache } from '@/apis/settings';
import { Trash2 } from 'lucide-react';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { Button } from '@/components/ui/button';
import { SkeletonCard } from './components';
import {
  ServerCard,
  QbitCard,
  SmtpCard,
  DatabaseCard,
  SessionCard,
  SecurityCard,
  ResourceCard,
  TmdbCard
} from './cards';

const Settings = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isPending: loading,
    refetch
  } = useQuery({
    queryKey: ['settings', 'info'],
    queryFn: fetchSettingsInfo
  });

  // 清除后端仪表盘缓存后，同步失效前端的 dashboard 缓存
  const clearCache = useMutation({
    mutationFn: clearDashboardCache,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-end gap-2'>
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

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          <SkeletonCard rows={5} />
          <SkeletonCard rows={3} />
          <SkeletonCard rows={4} />
          <SkeletonCard rows={3} />
          <SkeletonCard rows={3} />
          <SkeletonCard rows={2} />
          <SkeletonCard rows={1} />
          <SkeletonCard rows={2} />
        </div>
      ) : data ? (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          <ServerCard data={data.server} />
          <QbitCard data={data.qbit} />
          <SmtpCard data={data.smtp} />
          <DatabaseCard data={data.database} />
          <SessionCard data={data.session} />
          <SecurityCard data={data.security} />
          <ResourceCard data={data.resource} />
          <TmdbCard data={data.tmdb} />
        </div>
      ) : null}
    </div>
  );
};

export default Settings;
