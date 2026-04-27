import type { FeedbackListItem } from '@/apis';
import {
  createTableStore,
  resolveUpdater,
  type SimpleTableStore
} from '@/store/base';
import type { ColumnFiltersState, OnChangeFn } from '@tanstack/react-table';

interface FeedbackExtra {
  type: string[];
  status: string[];
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
}

type FeedbackStore = SimpleTableStore<FeedbackListItem> & FeedbackExtra;

const useFeedbackStore = createTableStore<FeedbackListItem, FeedbackExtra>(
  'feedback-store',
  set => ({
    type: [],
    status: [],
    setColumnFilters: updater => {
      set(state => {
        const base = state.columnFilters;
        const next = resolveUpdater(updater, base);
        return {
          columnFilters: next,
          type: (next.find(item => item.id === 'type')?.value ??
            []) as string[],
          status: (next.find(item => item.id === 'status')?.value ??
            []) as string[]
        } as Partial<FeedbackStore>;
      });
    }
  })
);

export { useFeedbackStore };
