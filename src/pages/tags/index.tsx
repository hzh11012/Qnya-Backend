import { DataTable } from '@/components/custom/data-table/data-table';
import columns from '@/pages/tags/columns';
import { useTagsStore } from '@/store/tags';
import { fetchTags, type TagsListParams } from '@/apis/tags';
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
    scope: 'tags',
    api: fetchTags,
    getParams: ({ page, pageSize, keyword, sort, order }): TagsListParams => ({
      page,
      pageSize,
      keyword,
      sort: sort as TagsListParams['sort'],
      order: order as TagsListParams['order']
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
