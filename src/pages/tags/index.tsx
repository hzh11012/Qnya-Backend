import React from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import columns from '@/pages/tags/columns';
import { useTagsStore } from '@/store';
import { getTagsList } from '@/apis';
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
    store: useTagsStore,
    api: getTagsList,
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
