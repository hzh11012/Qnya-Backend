import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DataTable } from '@/components/custom/data-table/data-table';
import getColumns from '@/pages/feedbacks/columns';
import { useFeedbackStore } from '@/store/feedbacks';
import { fetchFeedbacks, type FeedbackListParams } from '@/apis/feedbacks';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { useDataTablePage } from '@/hooks/use-data-table-page';

const Index: React.FC = () => {
  const { type, status, columnFilters, setColumnFilters } = useFeedbackStore(
    useShallow(state => ({
      type: state.type,
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
    store: useFeedbackStore,
    scope: 'feedbacks',
    api: fetchFeedbacks,
    getParams: ({
      page,
      pageSize,
      keyword,
      sort,
      order
    }): FeedbackListParams => ({
      page,
      pageSize,
      keyword,
      sort: sort as FeedbackListParams['sort'],
      order: order as FeedbackListParams['order'],
      type: type as FeedbackListParams['type'],
      status: status as FeedbackListParams['status']
    }),
    getPageData: res => ({ items: res.items, total: res.total }),
    cleanupExtra
  });

  const columns = useMemo(() => getColumns(refresh), [refresh]);

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
  );
};

export default Index;
