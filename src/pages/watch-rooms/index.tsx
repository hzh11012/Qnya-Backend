import { useMemo } from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import getColumns from '@/pages/watch-rooms/columns';
import { fetchWatchRooms, type WatchRoomListParams } from '@/apis/watch-rooms';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { createTablePage, filterValues } from '@/hooks/create-table-page';

const useWatchRoomPage = createTablePage({
  scope: 'watch-rooms',
  api: fetchWatchRooms,
  // 房间只有「存在」一种状态（解散即硬删除），筛选只剩可见性；
  // keyword 由后端同时匹配房间名与房主昵称
  getParams: ({
    page,
    pageSize,
    keyword,
    columnFilters
  }): WatchRoomListParams => ({
    page,
    pageSize,
    keyword,
    visibility: filterValues<string>(columnFilters, 'visibility')[0] as
      WatchRoomListParams['visibility'] | undefined
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
    isLoading,
    handleSearch,
    columnFilters,
    setColumnFilters
  } = useWatchRoomPage();

  const columns = useMemo(() => getColumns(refresh), [refresh]);

  return (
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <ListPageHeader
        label='Watch Rooms'
        title='放映室'
        description='全站放映室的管理与治理：公开/私人房间、解散与清理'
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
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          toolbar={
            <>
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
            </>
          }
        />
      </div>
    </div>
  );
};

export default Index;
