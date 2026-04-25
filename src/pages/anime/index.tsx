import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DataTable } from '@/components/custom/data-table/data-table';
import getColumns from '@/pages/anime/columns';
import { useAnimeStore } from '@/store';
import { useRequest } from 'ahooks';
import { getAnimeList, getSeriesOption, getTagsOption } from '@/apis';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import AddDialog from '@/pages/anime/add-dialog';

const Index: React.FC = () => {
  const {
    initialized,
    setInitialized,
    data,
    setData,
    keyword,
    setKeyword,
    total,
    setTotal,
    sorting,
    setSorting,
    sort,
    order,
    page,
    pageSize,
    resetPagination,
    pagination,
    setPagination,
    sizes,
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
      initialized: state.initialized,
      setInitialized: state.setInitialized,
      data: state.data,
      setData: state.setData,
      keyword: state.keyword,
      setKeyword: state.setKeyword,
      total: state.total,
      setTotal: state.setTotal,
      sorting: state.sorting,
      setSorting: state.setSorting,
      sort: state.sort,
      order: state.order,
      page: state.page,
      pageSize: state.pageSize,
      resetPagination: state.resetPagination,
      pagination: state.pagination,
      setPagination: state.setPagination,
      sizes: state.sizes,
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

  useEffect(() => {
    return () => {
      resetPagination();
      setTotal(0);
      setInitialized(false);
      setColumnFilters([]);
      setData([]);
    };
  }, [resetPagination, setTotal, setInitialized, setData]);

  const { run, loading, refresh, error } = useRequest(getAnimeList, {
    loadingDelay: 150,
    debounceWait: 250,
    defaultParams: [{ page, pageSize }],
    onSuccess: ({ items, total }) => {
      setData(items);
      setTotal(total);
    },
    onFinally: () => {
      setInitialized(true);
    },
    refreshDeps: [page, pageSize, sorting, columnFilters],
    refreshDepsAction: () => {
      run({
        page,
        pageSize,
        order,
        keyword,
        sort,
        status,
        types,
        months,
        years,
        tags
      });
    }
  });

  useRequest(getTagsOption, {
    onSuccess(options) {
      setTagsOption(options);
    }
  });

  useRequest(getSeriesOption, {
    onSuccess(options) {
      setSeriesOption(options);
    }
  });

  const columns = getColumns(() => {
    refresh();
  }, tagsOption, seriesOption);

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

  const isLoading = loading || !initialized;

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
        <>
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
        </>
      }
    />
  );
};

export default Index;
