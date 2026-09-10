import {
  createTableStore,
  resolveUpdater,
  type SimpleTableStore
} from '@/store/base';
import type { ColumnFiltersState, OnChangeFn } from '@tanstack/react-table';

interface AnimeExtra {
  status: string[];
  types: string[];
  months: string[];
  years: string[];
  tags: string[];
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
}

type AnimeStore = SimpleTableStore<AnimeExtra>;

const useAnimeStore = createTableStore<AnimeExtra>('anime-store', set => ({
  status: [],
  types: [],
  months: [],
  years: [],
  tags: [],
  setColumnFilters: updater => {
    set(state => {
      const base = state.columnFilters;
      const next = resolveUpdater(updater, base);
      return {
        columnFilters: next,
        status: (next.find(item => item.id === 'status')?.value ??
          []) as string[],
        types: (next.find(item => item.id === 'type')?.value ?? []) as string[],
        months: (next.find(item => item.id === 'month')?.value ??
          []) as string[],
        years: (next.find(item => item.id === 'year')?.value ?? []) as string[],
        tags: (next.find(item => item.id === 'tags')?.value ?? []) as string[]
      } as Partial<AnimeStore>;
    });
  }
}));

export { useAnimeStore };
