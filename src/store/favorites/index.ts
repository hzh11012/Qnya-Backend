import type { FavoriteListItem } from '@/apis';
import { createTableStore } from '@/store/base';

const useFavoritesStore = createTableStore<FavoriteListItem>('favorites-store');

export { useFavoritesStore };
