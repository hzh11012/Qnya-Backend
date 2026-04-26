import type { ScoreListItem } from '@/apis';
import {
  createTableStore,
  resolveUpdater,
  type SimpleTableStore
} from '@/store/base';
import type { ColumnFiltersState, OnChangeFn } from '@tanstack/react-table';

interface ScoreExtra {
  status: boolean[];
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
}

type ScoreStore = SimpleTableStore<ScoreListItem> & ScoreExtra;

const useScoreStore = createTableStore<ScoreListItem, ScoreExtra>(
  'score-store',
  set => ({
    status: [],
    setColumnFilters: updater => {
      set(state => {
        const base = state.columnFilters;
        const next = resolveUpdater(updater, base);
        return {
          columnFilters: next,
          status: (next.find(item => item.id === 'status')?.value ??
            []) as boolean[]
        } as Partial<ScoreStore>;
      });
    }
  })
);

export { useScoreStore };
