import { useMemo } from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import getColumns from '@/pages/favorites/columns';
import { useFavoritesStore } from '@/store/favorites';
import { fetchFavorites, type FavoriteListParams } from '@/apis/favorites';
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
    scope: 'favorites',
    api: fetchFavorites,
    getParams: ({
      page,
      pageSize,
      keyword,
      sort,
      order
    }): FavoriteListParams => ({
      page,
      pageSize,
      keyword,
      sort: sort as FavoriteListParams['sort'],
      order: order as FavoriteListParams['order']
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
