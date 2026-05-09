import { useRequest } from 'ahooks';
import { fetchSettingsInfo, clearDashboardCache } from '@/apis';
import { Trash2 } from 'lucide-react';
import { useRequest as useManualRequest } from 'ahooks';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { Button } from '@/components/ui/button';
import { SkeletonCard } from './components';
import {
  ServerCard,
  FfmpegCard,
  QbitCard,
  SmtpCard,
  DatabaseCard,
  SessionCard,
  SecurityCard,
  ResourceCard,
  TmdbCard
} from './cards';

const Settings = () => {
  const { data, loading, refresh } = useRequest(fetchSettingsInfo, {
    loadingDelay: 150
  });

  const { loading: clearing, run: runClear } = useManualRequest(
    clearDashboardCache,
    { manual: true }
  );

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-end gap-2'>
        <Button
          variant='outline'
          disabled={clearing}
          onClick={runClear}
          className='gap-1.5'
        >
          <Trash2 className='size-3.5' />
          清除仪表盘缓存
        </Button>
        <DataTableRefresh
          onRefresh={refresh}
          disabled={loading}
        />
      </div>

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          <SkeletonCard rows={5} />
          <SkeletonCard rows={7} />
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
          <FfmpegCard data={data.ffmpeg} />
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
