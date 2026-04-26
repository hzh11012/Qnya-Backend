import type { AnimeListItem, TagsOptionRes, SeriesOptionRes } from '@/apis';
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
  tagsOption: TagsOptionRes;
  seriesOption: SeriesOptionRes;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  setTagsOption: (tagsOption: TagsOptionRes) => void;
  setSeriesOption: (seriesOption: SeriesOptionRes) => void;
}

type AnimeStore = SimpleTableStore<AnimeListItem> & AnimeExtra;

const useAnimeStore = createTableStore<AnimeListItem, AnimeExtra>(
  'anime-store',
  set => ({
    status: [],
    types: [],
    months: [],
    years: [],
    tags: [],
    tagsOption: [],
    seriesOption: [],
    setColumnFilters: updater => {
      set(state => {
        const base = state.columnFilters;
        const next = resolveUpdater(updater, base);
        return {
          columnFilters: next,
          status: (next.find(item => item.id === 'status')?.value ??
            []) as string[],
          types: (next.find(item => item.id === 'type')?.value ??
            []) as string[],
          months: (next.find(item => item.id === 'month')?.value ??
            []) as string[],
          years: (next.find(item => item.id === 'year')?.value ??
            []) as string[],
          tags: (next.find(item => item.id === 'tags')?.value ?? []) as string[]
        } as Partial<AnimeStore>;
      });
    },
    setTagsOption: tagsOption => set({ tagsOption } as Partial<AnimeStore>),
    setSeriesOption: seriesOption =>
      set({ seriesOption } as Partial<AnimeStore>)
  })
);

export { useAnimeStore };
