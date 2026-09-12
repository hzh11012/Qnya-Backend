import { useMemo } from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import getColumns from '@/pages/dans/columns';
import { useDanmakuStore } from '@/store/dans';
import { fetchDanmakus, type DanmakuListParams } from '@/apis/dans';
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
    store: useDanmakuStore,
    scope: 'dans',
    api: fetchDanmakus,
    getParams: ({
      page,
      pageSize,
      keyword,
      sort,
      order
    }): DanmakuListParams => ({
      page,
      pageSize,
      keyword,
      // 表格排序状态是宽泛 string，此处收窄为 API 允许的字面量联合
      sort: sort as DanmakuListParams['sort'],
      order: order as DanmakuListParams['order']
    }),
    getPageData: res => ({ items: res.items, total: res.total })
  });

  const columns = useMemo(() => getColumns(refresh), [refresh]);

  return (
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <ListPageHeader
        label='Danmaku'
        title='弹幕'
        description='弹幕内容的检索与审核管理'
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
            <div className='flex flex-1 gap-6'>
              <div className='flex flex-1 items-center gap-6'>
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
      </div>
    </div>
  );
};

export default Index;
