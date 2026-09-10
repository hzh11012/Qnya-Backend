import { useMemo } from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import getColumns from '@/pages/histories/columns';
import { useHistoryStore } from '@/store/histories';
import { fetchHistories, type HistoryListParams } from '@/apis/histories';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { useDataTablePage } from '@/hooks/use-data-table-page';

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
    handleSearch
  } = useDataTablePage({
    store: useHistoryStore,
    scope: 'histories',
    api: fetchHistories,
    getParams: ({
      page,
      pageSize,
      keyword,
      sort,
      order
    }): HistoryListParams => ({
      page,
      pageSize,
      keyword,
      sort: sort as HistoryListParams['sort'],
      order: order as HistoryListParams['order']
    }),
    getPageData: res => ({ items: res.items, total: res.total })
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
