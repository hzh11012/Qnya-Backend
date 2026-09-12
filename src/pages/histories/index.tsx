import { useMemo } from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import getColumns from '@/pages/histories/columns';
import { fetchHistories, type HistoryListParams } from '@/apis/histories';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { createTablePage } from '@/hooks/create-table-page';

const useHistoryPage = createTablePage({
  scope: 'histories',
  api: fetchHistories,
  getParams: ({ page, pageSize, keyword, sort, order }): HistoryListParams => ({
    page,
    pageSize,
    keyword,
    sort: sort as HistoryListParams['sort'],
    order: order as HistoryListParams['order']
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
    handleSearch
  } = useHistoryPage();

  const columns = useMemo(() => getColumns(refresh), [refresh]);

  return (
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <ListPageHeader
        label='Histories'
        title='观看记录'
        description='用户观看历史记录'
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
