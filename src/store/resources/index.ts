import type { ResourcesListItem } from '@/apis';
import { createTableStore } from '@/store/base';

const useResourcesStore =
  createTableStore<ResourcesListItem>('resources-store');

export { useResourcesStore };
