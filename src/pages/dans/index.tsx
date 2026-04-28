import { useMemo } from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import getColumns from '@/pages/dans/columns';
import { useDanmakuStore } from '@/store';
import { fetchDanmakus } from '@/apis';
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
    run,
    refresh,
    error,
    isLoading,
    resetPagination,
    setKeyword,
    sort,
    order,
    pageSize
  } = useDataTablePage({
    store: useDanmakuStore,
    api: fetchDanmakus,
    getParams: ({ page, pageSize, keyword, sort, order }) => ({
      page,
      pageSize,
      keyword,
      sort,
      order
    }),
    onSuccess: (res, { setData, setTotal }) => {
      setData(res.items);
      setTotal(res.total);
    }
  });

  const columns = useMemo(() => getColumns(refresh), [refresh]);

  const handleSearch = (keyword: string) => {
    resetPagination();
    setKeyword(keyword);
    run({ page: 1, keyword, pageSize, sort, order });
  };

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
