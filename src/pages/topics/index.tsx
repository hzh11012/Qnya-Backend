import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import getColumns from '@/pages/topics/columns';
import { useTopicStore } from '@/store/topics';
import { fetchTopics, type TopicListParams } from '@/apis/topics';
import { useAnimeOptions } from '@/hooks/use-options';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import AddDialog from '@/pages/topics/add-dialog';
import { useDataTablePage } from '@/hooks/use-data-table-page';

const Index: React.FC = () => {
  const { status, columnFilters, setColumnFilters } = useTopicStore(
    useShallow(state => ({
      status: state.status,
      columnFilters: state.columnFilters,
      setColumnFilters: state.setColumnFilters
    }))
  );

  // 选项走 Query 缓存，与 videos 页共享同一份，5 分钟内不重复请求
  const animeOption = useAnimeOptions();

  const cleanupExtra = useCallback(() => {
    setColumnFilters([]);
  }, [setColumnFilters]);

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
    store: useTopicStore,
    scope: 'topics',
    api: fetchTopics,
    getParams: ({ page, pageSize, keyword, sort, order }): TopicListParams => ({
      page,
      pageSize,
      keyword,
      sort: sort as TopicListParams['sort'],
      order: order as TopicListParams['order'],
      status: status.map(s => (s ? 'true' : 'false'))
    }),
    getPageData: res => ({ items: res.items, total: res.total }),
    cleanupExtra
  });

  const columns = useMemo(
    () => getColumns(refresh, animeOption),
    [refresh, animeOption]
  );

  return (
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <ListPageHeader
        label='Topics'
        title='专题推荐'
        description='首页专题位的创建与内容编排'
      />
      <div className='animate-fade-up min-h-0 flex-1 [animation-delay:90ms]'>
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
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          toolbar={
            <div className='flex flex-1 gap-6'>
              <div className='flex flex-1 items-center gap-6'>
                <AddDialog
                  disabled={loading}
                  onRefresh={refresh}
                  animeOption={animeOption}
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
      </div>
    </div>
  );
};

export default Index;
