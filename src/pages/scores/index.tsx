import { useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import getColumns from '@/pages/scores/columns';
import { fetchScores, type ScoreListParams } from '@/apis/scores';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { createTablePage, filterValues } from '@/hooks/create-table-page';

const useScorePage = createTablePage({
  scope: 'scores',
  api: fetchScores,
  getParams: ({
    page,
    pageSize,
    keyword,
    sort,
    order,
    columnFilters
  }): ScoreListParams => ({
    page,
    pageSize,
    keyword,
    sort: sort as ScoreListParams['sort'],
    order: order as ScoreListParams['order'],
    status: filterValues<boolean>(columnFilters, 'status').map(s =>
      s ? 'true' : 'false'
    )
  }),
  getPageData: res => ({ items: res.items, total: res.total })
});

const Index: React.FC = () => {
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
    handleSearch,
    columnFilters,
    setColumnFilters
  } = useScorePage();

  const queryClient = useQueryClient();

  // 表刷新时同步失效概览统计：审核/删除评分后，概览的
  // “最新评分”“待处理反馈”不再等到 30s 缓存过期才更新
  const refreshAndInvalidateOverview = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    refresh();
  }, [queryClient, refresh]);

  const columns = useMemo(
    () => getColumns(refreshAndInvalidateOverview),
    [refreshAndInvalidateOverview]
  );

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
            <>
              <DataTableSearch
                onSearch={handleSearch}
                disabled={isLoading}
              />
              <DataTableRefresh
                onRefresh={refresh}
                disabled={isLoading}
              />
            </>
          }
        />
      </div>
    </div>
  );
};

export default Index;
