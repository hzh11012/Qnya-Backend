import { useMemo } from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import getColumns from '@/pages/users/columns';
import { fetchUsers, type UserListParams } from '@/apis/users';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { createTablePage, filterValues } from '@/hooks/create-table-page';

const useUserPage = createTablePage({
  scope: 'users',
  api: fetchUsers,
  getParams: ({
    page,
    pageSize,
    keyword,
    sort,
    order,
    columnFilters
  }): UserListParams => ({
    page,
    pageSize,
    keyword,
    sort: sort as UserListParams['sort'],
    order: order as UserListParams['order'],
    role: filterValues(columnFilters, 'role') as UserListParams['role'],
    status: filterValues<boolean>(columnFilters, 'status').map(s =>
      s ? 'true' : 'false'
    )
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
  } = useUserPage();

  const columns = useMemo(() => getColumns(refresh), [refresh]);

  return (
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <ListPageHeader
        label='Users'
        title='账户'
        description='站点用户账户与权限管理'
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
