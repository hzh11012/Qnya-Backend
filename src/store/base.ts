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

/**
 * 表格页 UI 状态 Slice（服务端数据由 TanStack Query 管理，不存入 store）
 *
 * @template TStore - 完整 Store 类型（包含此 slice）
 */
interface BaseTableState {
  sizes: number[];
  sorting: SortingState;
  keyword?: string;
  order?: string;
  sort?: string;
  columnFilters: ColumnFiltersState;
}

interface BaseTableActions {
  setSorting: OnChangeFn<SortingState>;
  setKeyword: (keyword?: string) => void;
  setOrder: (order?: string) => void;
  setSort: (sort?: string) => void;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
}

type BaseTableSlice = BaseTableState & BaseTableActions;

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
  sizes: [10, 20, 50],
  sorting: [],
  keyword: undefined,
  order: undefined,
  sort: undefined,
  columnFilters: []
} as const satisfies BaseTableState;

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
const createTableSlice = <TStore extends BaseTableSlice = BaseTableSlice>(
  initialState?: Partial<BaseTableState>
): StateCreator<TStore, [], [], BaseTableSlice> => {
  return set => ({
    ...DEFAULT_TABLE_STATE,
    ...initialState,
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

    setKeyword: keyword => set({ keyword } as Partial<TStore>),
    setOrder: order => set({ order } as Partial<TStore>),
    setSort: sort => set({ sort } as Partial<TStore>),
    setColumnFilters: updater => {
      set(
        state =>
          ({
            columnFilters: resolveUpdater(updater, state.columnFilters)
          }) as Partial<TStore>
      );
    }
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

type SimpleTableStore<TExtra extends object = object> = BaseTableSlice &
  BasePaginationSlice &
  TExtra;

type ExtendFn<TExtra extends object> = (
  set: Parameters<StateCreator<SimpleTableStore<TExtra>>>[0],
  get: Parameters<StateCreator<SimpleTableStore<TExtra>>>[1],
  store: Parameters<StateCreator<SimpleTableStore<TExtra>>>[2]
) => TExtra;

/**
 * 创建表格 Store 的工厂函数
 * @param name - devtools 中显示的 store 名称
 * @param extend - 可选，返回额外的 state/actions，可覆盖基础字段
 */
function createTableStore<TExtra extends object = object>(
  name: string,
  extend?: ExtendFn<TExtra>
) {
  type Store = SimpleTableStore<TExtra>;
  return create<Store>()(
    devtools(
      (set, get, store) => {
        const base = {
          ...createTableSlice<Store>()(
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
