import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useRequest } from 'ahooks';
import { DataTable } from '@/components/custom/data-table/data-table';
import getColumns from '@/pages/topics/columns';
import { useTopicStore } from '@/store';
import { fetchTopics, fetchAnimeOptions } from '@/apis';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import AddDialog from '@/pages/topics/add-dialog';
import { useDataTablePage } from '@/hooks/use-data-table-page';

const Index: React.FC = () => {
  const {
    status,
    columnFilters,
    setColumnFilters,
    animeOption,
    setAnimeOption
  } = useTopicStore(
    useShallow(state => ({
      status: state.status,
      columnFilters: state.columnFilters,
      setColumnFilters: state.setColumnFilters,
      animeOption: state.animeOption,
      setAnimeOption: state.setAnimeOption
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
    loading,
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
    store: useTopicStore,
    api: fetchTopics,
    getParams: ({ page, pageSize, keyword, sort, order }) => ({
      page,
      pageSize,
      keyword,
      sort,
      order,
      status
    }),
    onSuccess: (res, { setData, setTotal }) => {
      setData(res.items);
      setTotal(res.total);
    },
    refreshDeps: [columnFilters],
    cleanupExtra
  });

  useRequest(fetchAnimeOptions, {
    onSuccess(options) {
      setAnimeOption(options);
    }
  });

  const columns = useMemo(
    () => getColumns(refresh, animeOption),
    [refresh, animeOption]
  );

  const handleSearch = (keyword: string) => {
    resetPagination();
    setKeyword(keyword);
    run({
      page: 1,
      keyword,
      pageSize,
      sort,
      order,
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
  );
};

export default Index;
