import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import columns from '@/pages/torrents/columns';
import { fetchTorrents, type TorrentsListParams } from '@/apis/torrents';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import AddDialog from '@/pages/torrents/add-dialog';
import { createTablePage } from '@/hooks/create-table-page';

const useTorrentsPage = createTablePage({
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
  } = useTorrentsPage();

  return (
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <ListPageHeader
        label='Torrents'
        title='种子记录'
        description='种子检索与推送下载的历史记录'
      />
      <div className='animate-fade-up min-h-0 flex-1 [animation-delay:90ms]'>
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
      </div>
    </div>
  );
};

export default Index;
