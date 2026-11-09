import { useMemo } from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import getColumns from '@/pages/app-releases/columns';
import {
  fetchAppReleases,
  type AppReleaseListParams
} from '@/apis/app-releases';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import AppReleasePublishDialog from '@/pages/app-releases/publish-dialog';
import { createTablePage } from '@/hooks/create-table-page';

const useAppReleasePage = createTablePage({
  scope: 'app-releases',
  api: fetchAppReleases,
  getParams: ({ page, pageSize, sort, order }): AppReleaseListParams => ({
    page,
    pageSize,
    sort: sort as AppReleaseListParams['sort'],
    order: order as AppReleaseListParams['order']
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
    refresh,
    error,
    isLoading
  } = useAppReleasePage();

  const columns = useMemo(() => getColumns(refresh), [refresh]);

  return (
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <ListPageHeader
        label='App Releases'
        title='APP 版本发布'
        description='移动端应用内自更新的版本发布管理'
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
              <AppReleasePublishDialog onRefresh={refresh} />
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
