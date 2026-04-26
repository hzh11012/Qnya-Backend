import { useMemo } from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import getColumns from '@/pages/favorites/columns';
import { useFavoritesStore } from '@/store';
import { fetchFavorites } from '@/apis';
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
    store: useFavoritesStore,
    api: fetchFavorites,
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
  );
};

export default Index;
