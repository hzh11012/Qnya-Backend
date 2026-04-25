import { useEffect } from 'react';
import { useRequest } from 'ahooks';
import type { BaseTableSlice, BasePaginationSlice } from '@/store/base';
import { useShallow } from 'zustand/react/shallow';
import type { StoreApi, UseBoundStore } from 'zustand';

type DataTableStore = BaseTableSlice<any> & BasePaginationSlice;

interface UseDataTablePageOptions<TParams extends Record<string, any>, TRes> {
  store: UseBoundStore<StoreApi<DataTableStore>>;
  api: (params: TParams) => Promise<TRes>;
  getParams: (state: {
    page: number;
    pageSize: number;
    keyword?: string;
    sort?: string;
    order?: string;
  }) => TParams;
  onSuccess: (
    res: TRes,
    actions: {
      setData: (data: any[]) => void;
      setTotal: (total: number) => void;
      setHasMore: (hasMore: boolean) => void;
    }
  ) => void;
  refreshDeps?: any[];
  cleanupExtra?: () => void;
}

function useDataTablePage<TParams extends Record<string, any>, TRes>({
  store,
  api,
  getParams,
  onSuccess,
  refreshDeps = [],
  cleanupExtra
}: UseDataTablePageOptions<TParams, TRes>) {
  const state = store(
    useShallow(s => ({
      initialized: s.initialized,
      setInitialized: s.setInitialized,
      data: s.data,
      setData: s.setData,
      keyword: s.keyword,
      setKeyword: s.setKeyword,
      total: s.total,
      setTotal: s.setTotal,
      hasMore: s.hasMore,
      setHasMore: s.setHasMore,
      sorting: s.sorting,
      setSorting: s.setSorting,
      sort: s.sort,
      order: s.order,
      page: s.page,
      pageSize: s.pageSize,
      resetPagination: s.resetPagination,
      pagination: s.pagination,
      setPagination: s.setPagination,
      sizes: s.sizes
    }))
  );

  const {
    setInitialized,
    setData,
    setTotal,
    setHasMore,
    resetPagination,
    page,
    pageSize,
    keyword,
    sort,
    order,
    sorting
  } = state;

  useEffect(() => {
    return () => {
      resetPagination();
      setTotal(0);
      setHasMore(false);
      setInitialized(false);
      setData([]);
      cleanupExtra?.();
    };
  }, [
    resetPagination,
    setTotal,
    setHasMore,
    setInitialized,
    setData,
    cleanupExtra
  ]);

  const { run, loading, refresh, error } = useRequest(api, {
    loadingDelay: 150,
    debounceWait: 250,
    defaultParams: [getParams({ page, pageSize, keyword, sort, order })],
    onSuccess: (res: TRes) => {
      onSuccess(res, { setData, setTotal, setHasMore });
    },
    onFinally: () => {
      setInitialized(true);
    },
    refreshDeps: [page, pageSize, sorting, ...refreshDeps],
    refreshDepsAction: () => {
      run(getParams({ page, pageSize, keyword, sort, order }));
    }
  });

  const handleSearch = (kw: string) => {
    resetPagination();
    state.setKeyword(kw);
    run(getParams({ page: 1, pageSize, keyword: kw, sort, order }));
  };

  const isLoading = loading || !state.initialized;

  return {
    ...state,
    run,
    loading,
    refresh,
    error,
    isLoading,
    handleSearch
  };
}

export { useDataTablePage };
