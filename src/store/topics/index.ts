import type { TopicListItem, AnimeOptionRes } from '@/apis';
import {
  createTableStore,
  resolveUpdater,
  type SimpleTableStore
} from '@/store/base';
import type { ColumnFiltersState, OnChangeFn } from '@tanstack/react-table';

interface TopicExtra {
  status: boolean[];
  animeOption: AnimeOptionRes;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  setAnimeOption: (animeOption: AnimeOptionRes) => void;
}

type TopicStore = SimpleTableStore<TopicListItem> & TopicExtra;

const useTopicStore = createTableStore<TopicListItem, TopicExtra>(
  'topic-store',
  set => ({
    status: [],
    animeOption: [],
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
    },
    setAnimeOption: animeOption => set({ animeOption } as Partial<TopicStore>)
  })
);

export { useTopicStore };
