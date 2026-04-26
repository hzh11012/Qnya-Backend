import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DataTable } from '@/components/custom/data-table/data-table';
import getColumns from '@/pages/anime/columns';
import { useAnimeStore } from '@/store';
import { useRequest } from 'ahooks';
import { fetchAnimes, fetchSeriesOptions, fetchTagsOptions } from '@/apis';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import AddDialog from '@/pages/anime/add-dialog';
import { useDataTablePage } from '@/hooks/use-data-table-page';

const Index: React.FC = () => {
  const {
    status,
    types,
    months,
    years,
    tags,
    columnFilters,
    setColumnFilters,
    tagsOption,
    setTagsOption,
    seriesOption,
    setSeriesOption
  } = useAnimeStore(
    useShallow(state => ({
      status: state.status,
      types: state.types,
      months: state.months,
      years: state.years,
      tags: state.tags,
      columnFilters: state.columnFilters,
      setColumnFilters: state.setColumnFilters,
      tagsOption: state.tagsOption,
      setTagsOption: state.setTagsOption,
      seriesOption: state.seriesOption,
      setSeriesOption: state.setSeriesOption
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
    store: useAnimeStore,
    api: fetchAnimes,
    getParams: ({ page, pageSize, keyword, sort, order }) => ({
      page,
      pageSize,
      keyword,
      sort,
      order,
      status,
      types,
      months,
      years,
      tags
    }),
    onSuccess: (res, { setData, setTotal }) => {
      setData(res.items);
      setTotal(res.total);
    },
    refreshDeps: [columnFilters],
    cleanupExtra
  });

  useRequest(fetchTagsOptions, {
    onSuccess(options) {
      setTagsOption(options);
    }
  });

  useRequest(fetchSeriesOptions, {
    onSuccess(options) {
      setSeriesOption(options);
    }
  });

  const columns = useMemo(
    () => getColumns(refresh, tagsOption, seriesOption),
    [refresh, tagsOption, seriesOption]
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
      status,
      types,
      months,
      years,
      tags
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
              seriesOption={seriesOption}
              tagsOption={tagsOption}
              onRefresh={refresh}
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
