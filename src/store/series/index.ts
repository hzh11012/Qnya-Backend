import type { SeriesListItem } from '@/apis';
import { createTableStore } from '@/store/base';

const useSeriesStore = createTableStore<SeriesListItem>('series-store');

export { useSeriesStore };
