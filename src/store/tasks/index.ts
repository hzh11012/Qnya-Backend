import type { TasksListItem } from '@/apis';
import { createTableStore } from '@/store/base';

const useTasksStore = createTableStore<TasksListItem>('tasks-store');

export { useTasksStore };
