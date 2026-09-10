import { useMemo } from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import getColumns from '@/pages/videos/columns';
import { useVideoStore } from '@/store/videos';
import { fetchVideos, type VideoListParams } from '@/apis/videos';
import { useAnimeOptions } from '@/hooks/use-options';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import AddDialog from '@/pages/videos/add-dialog';
import { useDataTablePage } from '@/hooks/use-data-table-page';

const Index: React.FC = () => {
  // 选项走 Query 缓存，与 topics 页共享同一份，5 分钟内不重复请求
  const animeOptions = useAnimeOptions();

  const {
    data,
    total,
    pagination,
    sorting,
    setSorting,
    setPagination,
    sizes,
    loading,
    refresh,
    error,
    isLoading,
    handleSearch
  } = useDataTablePage({
    store: useVideoStore,
    scope: 'videos',
    api: fetchVideos,
    getParams: ({ page, pageSize, keyword, sort, order }): VideoListParams => ({
      page,
      pageSize,
      keyword,
      sort: sort as VideoListParams['sort'],
      order: order as VideoListParams['order']
    }),
    getPageData: res => ({ items: res.items, total: res.total })
  });

  const columns = useMemo(
    () => getColumns(refresh, animeOptions),
    [refresh, animeOptions]
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={isLoading}
      pagination={pagination}
      paginationConfig={{ mode: 'total', total }}
      onPaginationChange={setPagination}
      sorting={sorting}
      onSortingChange={setSorting}
      sizes={sizes}
      error={!!error}
      toolbar={
        <div className='flex flex-1 gap-6'>
          <div className='flex flex-1 items-center gap-6'>
            <AddDialog
              disabled={loading}
              onRefresh={refresh}
              animeOptions={animeOptions}
            />
            <DataTableSearch
              onSearch={handleSearch}
              disabled={isLoading}
            />
          </div>
          <DataTableRefresh
            onRefresh={refresh}
            disabled={isLoading}
          />
        </div>
      }
    />
  );
};

export default Index;
