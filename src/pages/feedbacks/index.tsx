import { useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import getColumns from '@/pages/feedbacks/columns';
import { fetchFeedbacks, type FeedbackListParams } from '@/apis/feedbacks';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { createTablePage, filterValues } from '@/hooks/create-table-page';

const useFeedbackPage = createTablePage({
  scope: 'feedbacks',
  api: fetchFeedbacks,
  getParams: ({
    page,
    pageSize,
    keyword,
    sort,
    order,
    columnFilters
  }): FeedbackListParams => ({
    page,
    pageSize,
    keyword,
    sort: sort as FeedbackListParams['sort'],
    order: order as FeedbackListParams['order'],
    type: filterValues(columnFilters, 'type') as FeedbackListParams['type'],
    status: filterValues(
      columnFilters,
      'status'
    ) as FeedbackListParams['status']
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
  } = useFeedbackPage();

  const queryClient = useQueryClient();

  // 表刷新时同步失效概览统计：处理/删除反馈后，概览的
  // “待处理反馈”计数与列表不再等到 30s 缓存过期才更新
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
        label='Feedbacks'
        title='问题反馈'
        description='用户提交的问题反馈处理'
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
