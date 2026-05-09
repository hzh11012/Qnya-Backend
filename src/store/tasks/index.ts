import type { TasksListItem } from '@/apis';
import {
  createTableStore,
  resolveUpdater,
  type SimpleTableStore
} from '@/store/base';
import type { ColumnFiltersState, OnChangeFn } from '@tanstack/react-table';

interface TasksExtra {
  status: string[];
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
}

type TasksStore = SimpleTableStore<TasksListItem> & TasksExtra;

const useTasksStore = createTableStore<TasksListItem, TasksExtra>(
  'tasks-store',
  set => ({
    status: [],
    setColumnFilters: updater => {
      set(state => {
        const base = state.columnFilters;
        const next = resolveUpdater(updater, base);
        return {
          columnFilters: next,
          status: (next.find(item => item.id === 'status')?.value ??
            []) as string[]
        } as Partial<TasksStore>;
      });
    }
  })
);

export { useTasksStore };
