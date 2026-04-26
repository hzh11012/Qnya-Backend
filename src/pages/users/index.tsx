import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DataTable } from '@/components/custom/data-table/data-table';
import getColumns from '@/pages/users/columns';
import { useUserStore } from '@/store';
import { fetchUsers } from '@/apis';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { useDataTablePage } from '@/hooks/use-data-table-page';

const Index: React.FC = () => {
  const { role, status, columnFilters, setColumnFilters } = useUserStore(
    useShallow(state => ({
      role: state.role,
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
    store: useUserStore,
    api: fetchUsers,
    getParams: ({ page, pageSize, keyword, sort, order }) => ({
      page,
      pageSize,
      keyword,
      sort,
      order,
      role,
      status
    }),
    onSuccess: (res, { setData, setTotal }) => {
      setData(res.items);
      setTotal(res.total);
    },
    refreshDeps: [columnFilters],
    cleanupExtra
  });

  const columns = useMemo(() => getColumns(refresh), [refresh]);

  const handleSearch = (keyword: string) => {
    resetPagination();
    setKeyword(keyword);
    run({
      page: 1,
      keyword,
      pageSize,
      sort,
      order,
      role,
      status
    });
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
