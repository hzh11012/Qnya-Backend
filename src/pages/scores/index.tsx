import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import getColumns from '@/pages/scores/columns';
import { useScoreStore } from '@/store/scores';
import { fetchScores, type ScoreListParams } from '@/apis/scores';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { useDataTablePage } from '@/hooks/use-data-table-page';

const Index: React.FC = () => {
  const { status, columnFilters, setColumnFilters } = useScoreStore(
    useShallow(state => ({
      status: state.status,
      columnFilters: state.columnFilters,
      setColumnFilters: state.setColumnFilters
    }))
  );

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
    refresh,
    error,
    isLoading,
    handleSearch
  } = useDataTablePage({
    store: useScoreStore,
    scope: 'scores',
    api: fetchScores,
    getParams: ({ page, pageSize, keyword, sort, order }): ScoreListParams => ({
      page,
      pageSize,
      keyword,
      sort: sort as ScoreListParams['sort'],
      order: order as ScoreListParams['order'],
      status: status.map(s => (s ? 'true' : 'false'))
    }),
    getPageData: res => ({ items: res.items, total: res.total }),
    cleanupExtra
  });

  const columns = useMemo(() => getColumns(refresh), [refresh]);

  return (
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <ListPageHeader
        label='Scores'
        title='评分'
        description='用户对番剧的评分记录'
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
