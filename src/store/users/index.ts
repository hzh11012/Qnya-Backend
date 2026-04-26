import type { UserListItem } from '@/apis';
import {
  createTableStore,
  resolveUpdater,
  type SimpleTableStore
} from '@/store/base';
import type { ColumnFiltersState, OnChangeFn } from '@tanstack/react-table';

interface UserExtra {
  role: string[];
  status: boolean[];
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
}

type UserStore = SimpleTableStore<UserListItem> & UserExtra;

const useUserStore = createTableStore<UserListItem, UserExtra>(
  'user-store',
  set => ({
    role: [],
    status: [],
    setColumnFilters: updater => {
      set(state => {
        const base = state.columnFilters;
        const next = resolveUpdater(updater, base);
        return {
          columnFilters: next,
          role: (next.find(item => item.id === 'role')?.value ??
            []) as string[],
          status: (next.find(item => item.id === 'status')?.value ??
            []) as boolean[]
        } as Partial<UserStore>;
      });
    }
  })
);

export { useUserStore };
