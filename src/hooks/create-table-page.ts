import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ColumnFiltersState } from '@tanstack/react-table';
import { useShallow } from 'zustand/react/shallow';
import { createTableStore, type SimpleTableStore } from '@/store/base';

type TablePageState = SimpleTableStore;

/** 传给 getParams 的请求参数派生源（只含数据字段，不含 actions） */
interface TablePageParamsSource {
  page: number;
  pageSize: number;
  keyword?: string;
  sort?: string;
  order?: string;
  columnFilters: ColumnFiltersState;
}

interface CreateTablePageOptions<
  TParams extends Record<string, unknown>,
  TRes,
  TItem
> {
  /** 查询缓存作用域（queryKey 前缀），同时用作 devtools store 名称 */
  scope: string;
  api: (params: TParams) => Promise<TRes>;
  /** 从 UI 状态派生请求参数，列筛选值也由此派生（不单独存储） */
  getParams: (state: TablePageParamsSource) => TParams;
  /** 从响应中提取列表数据与分页信息 */
  getPageData: (res: TRes) => {
    items: TItem[];
    total?: number;
    hasMore?: boolean;
  };
}

/**
 * 从 columnFilters 中取出指定列的筛值（列筛选是唯一真相源，不双写进 store）
 *
 * @example
 * filterValues(columnFilters, 'status');        // string[]
 * filterValues<boolean>(columnFilters, 'status'); // boolean[]
 */
const filterValues = <T = string>(
  columnFilters: ColumnFiltersState,
  id: string
): T[] => (columnFilters.find(item => item.id === id)?.value ?? []) as T[];

/**
 * 表格页工厂：一次性创建页面专属的 zustand store 与数据 hook，
 * 收敛 store 工厂 + useDataTablePage + 卸载清理的三件套样板
 *
 * @example
 * const useTagsPage = createTablePage({
 *   scope: 'tags',
 *   api: fetchTags,
 *   getParams: ({ page, pageSize, keyword, sort, order }) => ({...}),
 *   getPageData: res => ({ items: res.items, total: res.total })
 * });
 */
function createTablePage<TParams extends Record<string, unknown>, TRes, TItem>({
  scope,
  api,
  getParams,
  getPageData
}: CreateTablePageOptions<TParams, TRes, TItem>) {
  const useStore = createTableStore(`${scope}-store`);

  const useTablePage = () => {
    const state = useStore(
      useShallow(s => ({
        pagination: s.pagination,
        sorting: s.sorting,
        sizes: s.sizes,
        page: s.page,
        pageSize: s.pageSize,
        keyword: s.keyword,
        sort: s.sort,
        order: s.order,
        columnFilters: s.columnFilters,
        setSorting: s.setSorting,
        setPagination: s.setPagination,
        setKeyword: s.setKeyword,
        resetPagination: s.resetPagination,
        setColumnFilters: s.setColumnFilters
      }))
    );

    const {
      pagination,
      sorting,
      sizes,
      columnFilters,
      setSorting,
      setPagination,
      setKeyword,
      resetPagination,
      setColumnFilters
    } = state;

    // 卸载时重置 UI 状态，避免下次进入残留（keyword 也要清，
    // 否则搜索框重新挂载后为空但数据仍按旧关键词筛选，表里不一致）
    useEffect(
      () => () => {
        resetPagination();
        setColumnFilters([]);
        setKeyword('');
      },
      [resetPagination, setColumnFilters, setKeyword]
    );

    // 参数由 zustand UI 状态派生，变化即自动重新请求
    const params = getParams({
      page: state.page,
      pageSize: state.pageSize,
      keyword: state.keyword,
      sort: state.sort,
      order: state.order,
      columnFilters: state.columnFilters
    });

    const {
      data: res,
      error,
      isPending,
      isPlaceholderData,
      isFetching,
      refetch
    } = useQuery({
      queryKey: [scope, params],
      queryFn: () => api(params),
      placeholderData: keepPreviousData,
      staleTime: 30_000
    });

    const pageData = res ? getPageData(res) : undefined;

    /** 搜索：重置分页并更新关键词，触发 queryKey 变更自动请求 */
    const handleSearch = (kw: string) => {
      resetPagination();
      setKeyword(kw);
    };

    // 删除等操作导致当前页数据被清空时，自动回退到上一页
    // （连续删会逐页回退，直到遇到非空页或回到第一页；第一页为空属正常空态，不处理）
    useEffect(() => {
      if (
        !isFetching &&
        !error &&
        res &&
        pageData &&
        !pageData.items.length &&
        state.page > 1
      ) {
        setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
      }
    }, [isFetching, error, res, pageData, state.page, setPagination]);

    return {
      data: pageData?.items ?? [],
      total: pageData?.total ?? 0,
      hasMore: pageData?.hasMore ?? false,
      pagination,
      sorting,
      sizes,
      columnFilters,
      setSorting,
      setPagination,
      setColumnFilters,
      /** 请求飞行中 */
      loading: isFetching,
      /** 首次加载或翻页中（保留旧数据渲染 + loading 态） */
      isLoading: isPending || isPlaceholderData,
      error,
      refresh: refetch,
      handleSearch
    };
  };

  return useTablePage;
}

export { createTablePage, filterValues, type TablePageState };
