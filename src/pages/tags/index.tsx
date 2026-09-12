import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import columns from '@/pages/tags/columns';
import { fetchTags, type TagsListParams } from '@/apis/tags';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import { createTablePage } from '@/hooks/create-table-page';

const useTagsPage = createTablePage({
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
  } = useTagsPage();

  return (
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <ListPageHeader
        label='Tags'
        title='标签管理'
        description='标签的增删改查，用于番剧内容归类与筛选'
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
