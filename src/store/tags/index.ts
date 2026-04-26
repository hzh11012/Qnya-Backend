import type { TagsListItem } from '@/apis';
import { createTableStore } from '@/store/base';

const useTagsStore = createTableStore<TagsListItem>('tags-store');

export { useTagsStore };
