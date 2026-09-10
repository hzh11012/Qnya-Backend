import { DataTable } from '@/components/custom/data-table/data-table';
import columns from '@/pages/torrents/columns';
import { useTorrentsStore } from '@/store/torrents';
import { fetchTorrents, type TorrentsListParams } from '@/apis/torrents';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import AddDialog from '@/pages/torrents/add-dialog';
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
    loading,
    refresh,
    error,
    isLoading
  } = useDataTablePage({
    store: useTorrentsStore,
    scope: 'torrents',
    api: fetchTorrents,
    getParams: ({ page, pageSize, sort, order }): TorrentsListParams => ({
      page,
      pageSize,
      sort: sort as TorrentsListParams['sort'],
      order: order as TorrentsListParams['order']
    }),
    getPageData: res => ({ items: res.items, total: res.total })
  });

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
          <AddDialog
            disabled={loading}
            onRefresh={refresh}
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
