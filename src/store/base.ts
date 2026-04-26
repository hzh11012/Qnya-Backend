import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  Updater
} from '@tanstack/react-table';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

interface BaseTableState<TData> {
  initialized: boolean;
  data: TData[];
  total: number;
  hasMore: boolean;
  sizes: number[];
  sorting: SortingState;
  type: string;
  keyword?: string;
  order?: string;
  sort?: string;
  columnFilters: ColumnFiltersState;
}

interface BaseTableActions<TData> {
  setInitialized: (initialized: boolean) => void;
  setData: (data: TData[]) => void;
  setTotal: (total: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setSorting: OnChangeFn<SortingState>;
  setType: (type: string) => void;
  setKeyword: (keyword?: string) => void;
  setOrder: (order?: string) => void;
  setSort: (sort?: string) => void;
}

type BaseTableSlice<TData> = BaseTableState<TData> & BaseTableActions<TData>;

interface BasePaginationState {
  page: number;
  pageSize: number;
  pagination: PaginationState;
}

interface BasePaginationActions {
  setPagination: OnChangeFn<PaginationState>;
  resetPagination: () => void;
}

type BasePaginationSlice = BasePaginationState & BasePaginationActions;

const DEFAULT_TABLE_STATE = {
  initialized: false,
  data: [],
  total: 0,
  hasMore: false,
  sizes: [10, 20, 50],
  sorting: [],
  type: 'name',
  keyword: undefined,
  order: undefined,
  sort: undefined,
  columnFilters: []
} as const satisfies Omit<BaseTableState<unknown>, 'data'> & {
  data: unknown[];
};

const DEFAULT_PAGINATION_STATE = {
  page: 1,
  pageSize: 10,
  pagination: {
    pageIndex: 0,
    pageSize: 10
  }
} as const satisfies BasePaginationState;

function resolveUpdater<T>(updater: Updater<T>, currentValue: T): T {
  return typeof updater === 'function'
    ? (updater as (old: T) => T)(currentValue)
    : updater;
}

/**
 * 创建表格 Slice
 * @template TData - 表格数据项类型
 * @template TStore - 完整 Store 类型（包含此 slice）
 */
const createTableSlice = <
  TData,
  TStore extends BaseTableSlice<TData> = BaseTableSlice<TData>
>(
  initialState?: Partial<BaseTableState<TData>>
): StateCreator<TStore, [], [], BaseTableSlice<TData>> => {
  return set => ({
    ...DEFAULT_TABLE_STATE,
    data: [] as TData[],
    ...initialState,
    setInitialized: initialized => set({ initialized } as Partial<TStore>),
    setData: data => set({ data } as Partial<TStore>),
    setTotal: total => set({ total } as Partial<TStore>),
    setHasMore: hasMore => set({ hasMore } as Partial<TStore>),
    setSorting: updater => {
      set(state => {
        const nextSorting = resolveUpdater(updater, state.sorting);
        const firstSort = nextSorting[0];

        return {
          sorting: nextSorting,
          order: firstSort ? (firstSort.desc ? 'desc' : 'asc') : undefined,
          sort: firstSort?.id
        } as Partial<TStore>;
      });
    },

    setType: type => set({ type } as Partial<TStore>),
    setKeyword: keyword => set({ keyword } as Partial<TStore>),
    setOrder: order => set({ order } as Partial<TStore>),
    setSort: sort => set({ sort } as Partial<TStore>)
  });
};

/**
 * 创建分页 Slice
 * @template TStore - 完整 Store 类型（包含此 slice）
 */
const createPaginationSlice = <
  TStore extends BasePaginationSlice = BasePaginationSlice
>(
  initialState?: Partial<BasePaginationState>
): StateCreator<TStore, [], [], BasePaginationSlice> => {
  return set => ({
    ...DEFAULT_PAGINATION_STATE,
    ...initialState,
    setPagination: updater => {
      set(state => {
        const nextPagination = resolveUpdater(updater, state.pagination);
        return {
          pagination: nextPagination,
          page: nextPagination.pageIndex + 1,
          pageSize: nextPagination.pageSize
        } as Partial<TStore>;
      });
    },
    resetPagination: () => {
      set(
        state =>
          ({
            pagination: { ...state.pagination, pageIndex: 0 },
            page: 1
          }) as Partial<TStore>
      );
    }
  });
};

type SimpleTableStore<TData> = BaseTableSlice<TData> & BasePaginationSlice;

type ExtendFn<TData, TExtra> = (
  set: Parameters<StateCreator<SimpleTableStore<TData> & TExtra>>[0],
  get: Parameters<StateCreator<SimpleTableStore<TData> & TExtra>>[1],
  store: Parameters<StateCreator<SimpleTableStore<TData> & TExtra>>[2]
) => TExtra;

/**
 * 创建表格 Store 的工厂函数
 * @param name - devtools 中显示的 store 名称
 * @param extend - 可选，返回额外的 state/actions，可覆盖基础字段
 */
function createTableStore<TData, TExtra = object>(
  name: string,
  extend?: ExtendFn<TData, TExtra>
) {
  type Store = SimpleTableStore<TData> & TExtra;
  return create<Store>()(
    devtools(
      (set, get, store) => {
        const base = {
          ...createTableSlice<TData, Store>()(
            set as Parameters<StateCreator<Store>>[0],
            get as Parameters<StateCreator<Store>>[1],
            store as Parameters<StateCreator<Store>>[2]
          ),
          ...createPaginationSlice<Store>()(
            set as Parameters<StateCreator<Store>>[0],
            get as Parameters<StateCreator<Store>>[1],
            store as Parameters<StateCreator<Store>>[2]
          )
        };
        const extra = extend?.(set, get, store) ?? ({} as TExtra);
        return { ...base, ...extra } as Store;
      },
      { name }
    )
  );
}

export {
  resolveUpdater,
  createTableSlice,
  createPaginationSlice,
  createTableStore,
  type SimpleTableStore,
  type BaseTableSlice,
  type BaseTableState,
  type BasePaginationSlice,
  type BasePaginationState
};
