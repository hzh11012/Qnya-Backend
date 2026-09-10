import {
  createTableStore,
  resolveUpdater,
  type SimpleTableStore
} from '@/store/base';
import type { ColumnFiltersState, OnChangeFn } from '@tanstack/react-table';

interface TopicExtra {
  status: boolean[];
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
}

type TopicStore = SimpleTableStore<TopicExtra>;

const useTopicStore = createTableStore<TopicExtra>('topic-store', set => ({
  status: [],
  setColumnFilters: updater => {
    set(state => {
      const base = state.columnFilters;
      const next = resolveUpdater(updater, base);
      return {
        columnFilters: next,
        status: (next.find(item => item.id === 'status')?.value ??
          []) as boolean[]
      } as Partial<TopicStore>;
    });
  }
}));

export { useTopicStore };
