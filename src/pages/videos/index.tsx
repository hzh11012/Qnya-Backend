import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DataTable } from '@/components/custom/data-table/data-table';
import getColumns from '@/pages/videos/columns';
import { useVideoStore } from '@/store';
import { fetchVideos, fetchAnimeOptions } from '@/apis';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import AddDialog from '@/pages/videos/add-dialog';
import { useDataTablePage } from '@/hooks/use-data-table-page';
import { useRequest } from 'ahooks';

const Index: React.FC = () => {
  const { animeOptions, setAnimeOptions } = useVideoStore(
    useShallow(state => ({
      animeOptions: state.animeOptions,
      setAnimeOptions: state.setAnimeOptions
    }))
  );

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
    store: useVideoStore,
    api: fetchVideos,
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

  useRequest(fetchAnimeOptions, {
    onSuccess(options) {
      setAnimeOptions(options);
    }
  });

  const columns = useMemo(
    () => getColumns(refresh, animeOptions),
    [refresh, animeOptions]
  );

  const handleSearch = (keyword: string) => {
    resetPagination();
    setKeyword(keyword);
    run({
      page: 1,
      keyword,
      pageSize,
      sort,
      order
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
      toolbar={
        <div className='flex flex-1 gap-6'>
          <div className='flex flex-1 items-center gap-6'>
            <AddDialog
              disabled={loading}
              onRefresh={refresh}
              animeOptions={animeOptions}
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
