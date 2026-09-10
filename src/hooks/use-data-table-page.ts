import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { BaseTableSlice, BasePaginationSlice } from '@/store/base';
import { useShallow } from 'zustand/react/shallow';
import type { StoreApi, UseBoundStore } from 'zustand';

/**
 * 表格页 UI 状态切片（分页/关键词/排序等由 zustand 管理，
 * 服务端数据由 TanStack Query 管理，不再写入 store）
 */
type DataTableStore = BaseTableSlice & BasePaginationSlice;

interface UseDataTablePageOptions<TParams extends Record<string, any>, TRes> {
  /** zustand UI 状态 store */
  store: UseBoundStore<StoreApi<DataTableStore>>;
  /** 查询缓存作用域标识，不同页面/API 必须唯一（queryKey 前缀） */
  scope: string;
  api: (params: TParams) => Promise<TRes>;
  getParams: (state: {
    page: number;
    pageSize: number;
    keyword?: string;
    sort?: string;
    order?: string;
  }) => TParams;
  /** 从响应中提取列表数据与分页信息 */
  getPageData: (res: TRes) => {
    items: any[];
    total?: number;
    hasMore?: boolean;
  };
  /** 卸载时的额外清理（如重置筛选状态） */
  cleanupExtra?: () => void;
}

function useDataTablePage<TParams extends Record<string, any>, TRes>({
  store,
  scope,
  api,
  getParams,
  getPageData,
  cleanupExtra
}: UseDataTablePageOptions<TParams, TRes>) {
  const state = store(
    useShallow(s => ({
      pagination: s.pagination,
      sorting: s.sorting,
      sizes: s.sizes,
      page: s.page,
      pageSize: s.pageSize,
      keyword: s.keyword,
      sort: s.sort,
      order: s.order,
      setSorting: s.setSorting,
      setPagination: s.setPagination,
      setKeyword: s.setKeyword,
      resetPagination: s.resetPagination
    }))
  );

  const {
    pagination,
    sorting,
    sizes,
    page,
    pageSize,
    keyword,
    sort,
    order,
    setSorting,
    setPagination,
    setKeyword,
    resetPagination
  } = state;

  // 卸载时重置 UI 状态，避免下次进入残留
  useEffect(
    () => () => {
      resetPagination();
      cleanupExtra?.();
    },
    [resetPagination, cleanupExtra]
  );

  // 参数由 zustand UI 状态派生，变化即自动重新请求
  const params = getParams({ page, pageSize, keyword, sort, order });

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

  return {
    data: pageData?.items ?? [],
    total: pageData?.total ?? 0,
    hasMore: pageData?.hasMore ?? false,
    pagination,
    sorting,
    sizes,
    setSorting,
    setPagination,
    /** 请求飞行中 */
    loading: isFetching,
    /** 首次加载或翻页中（保留旧数据渲染 + loading 态） */
    isLoading: isPending || isPlaceholderData,
    error,
    refresh: refetch,
    handleSearch,
    resetPagination,
    setKeyword,
    keyword,
    sort,
    order,
    pageSize
  };
}

export { useDataTablePage };
