import { useMemo } from 'react';
import { DataTable } from '@/components/custom/data-table/data-table';
import ListPageHeader from '@/components/custom/data-table/list-page-header';
import getColumns from '@/pages/anime/columns';
import { fetchAnimes, type AnimeListParams } from '@/apis/anime';
import { useSeriesOptions, useTagsOptions } from '@/hooks/use-options';
import DataTableSearch from '@/components/custom/data-table/data-table-search';
import DataTableRefresh from '@/components/custom/data-table/data-table-refresh';
import AddDialog from '@/pages/anime/add-dialog';
import { createTablePage, filterValues } from '@/hooks/create-table-page';

const useAnimePage = createTablePage({
  scope: 'anime',
  api: fetchAnimes,
  getParams: ({
    page,
    pageSize,
    keyword,
    sort,
    order,
    columnFilters
  }): AnimeListParams => ({
    page,
    pageSize,
    keyword,
    sort: sort as AnimeListParams['sort'],
    order: order as AnimeListParams['order'],
    status: filterValues(columnFilters, 'status') as AnimeListParams['status'],
    types: filterValues(columnFilters, 'type') as AnimeListParams['types'],
    months: filterValues(columnFilters, 'month') as AnimeListParams['months'],
    years: filterValues(columnFilters, 'year') as AnimeListParams['years'],
    tags: filterValues(columnFilters, 'tags').map(Number)
  }),
  getPageData: res => ({ items: res.items, total: res.total })
});

const Index: React.FC = () => {
  // 选项走 Query 缓存，跨页面共享、5 分钟内不重复请求
  const tagsOption = useTagsOptions();
  const seriesOption = useSeriesOptions();

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
    isLoading,
    handleSearch,
    columnFilters,
    setColumnFilters
  } = useAnimePage();

  const columns = useMemo(
    () => getColumns(refresh, tagsOption, seriesOption),
    [refresh, tagsOption, seriesOption]
  );

  return (
    <div className='flex h-full min-h-0 flex-col gap-6'>
      <ListPageHeader
        label='Anime'
        title='番剧'
        description='番剧资料的增删改查，关联系列、标签与剧集'
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
                <AddDialog
                  disabled={loading}
                  seriesOption={seriesOption}
                  tagsOption={tagsOption}
                  onRefresh={refresh}
                />
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
