import { DataTable } from '@/components/custom/data-table/data-table';
import columns from '@/pages/resources/columns';
import { useResourcesStore } from '@/store/resources';
import { fetchResources } from '@/apis/resources';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { useDataTablePage } from '@/hooks/use-data-table-page';

const Index: React.FC = () => {
  const {
    data,
    hasMore,
    pagination,
    setPagination,
    sizes,
    refresh,
    error,
    isLoading,
    handleSearch
  } = useDataTablePage({
    store: useResourcesStore,
    scope: 'resources',
    api: fetchResources,
    getParams: ({ page, pageSize, keyword }) => ({
      page,
      pageSize,
      keyword
    }),
    getPageData: res => ({ items: res.items, hasMore: res.hasMore })
  });

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={isLoading}
      pagination={pagination}
      paginationConfig={{ mode: 'hasMore', hasMore }}
      onPaginationChange={setPagination}
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
