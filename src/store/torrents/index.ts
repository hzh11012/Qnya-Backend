import type { TorrentsListItem } from '@/apis';
import { createTableStore, resolveUpdater } from '@/store/base';
import type { OnChangeFn, SortingState } from '@tanstack/react-table';

interface TorrentsExtra {
  setSorting: OnChangeFn<SortingState>;
}

const useTorrentsStore = createTableStore<TorrentsListItem, TorrentsExtra>(
  'torrents-store',
  set => ({
    setSorting: updater => {
      set(state => {
        const nextSorting = resolveUpdater(updater, state.sorting);
        const firstSort = nextSorting[0];
        const sortMap: Record<string, string> = {
          createdAt: 'added_on',
          size: 'size'
        };

        return {
          sorting: nextSorting,
          order: firstSort ? (firstSort.desc ? 'desc' : 'asc') : undefined,
          sort: sortMap[firstSort?.id]
        };
      });
    }
  })
);

export { useTorrentsStore };
