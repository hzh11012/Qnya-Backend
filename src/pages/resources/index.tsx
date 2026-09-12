import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
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
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <ListPageHeader
        label='Resources'
        title='资源检索'
        description='外部资源站检索结果，可推送至 qBittorrent 下载'
      />
      <div className='animate-fade-up min-h-0 flex-1 [animation-delay:90ms]'>
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
      </div>
    </div>
  );
};

export default Index;
