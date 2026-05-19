import type { TasksListItem } from '@/apis';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatFileSize } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import RowActions from '@/pages/tasks/row-actions';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';
import DataTableColumnSort from '@/components/custom/data-table/data-table-column-sort';

type TaskStatusType = 'success' | 'muted';

interface TaskStatusConfig {
  label: string;
  type: TaskStatusType;
}

export const taskStatusMap: Record<string, TaskStatusConfig> = {
  'pending': { label: '待入库', type: 'muted' },
  'completed': { label: '已完成', type: 'success' }
};

const statusFilterOptions = Object.entries(taskStatusMap).map(
  ([value, config]) => ({ label: config.label, value })
);

const getColumns = (onRefresh: () => void) => {
  const columns: ColumnDef<TasksListItem>[] = [
    {
      accessorKey: 'filename',
      header: () => {
        return (
          <div className='flex items-center gap-1'>
            <span>文件名称</span>
            <Search className='size-3.5' />
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        const facets = column.getFacetedUniqueValues();
        const filterValue = (column.getFilterValue() as string[]) ?? [];
        return (
          <div className='flex items-center gap-1'>
            <span>状态</span>
            <DataTableColumnFilter
              facets={facets}
              filterValue={filterValue}
              options={statusFilterOptions}
              onFilterChange={val => column.setFilterValue(val)}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const { status } = row.original;
        const config = taskStatusMap[status];
        return <Badge variant={config.type}>{config.label}</Badge>;
      }
    },
    {
      accessorKey: 'fileSize',
      header: ({ column }) => (
        <div className='flex items-center gap-1'>
          <span>资源大小</span>
          <DataTableColumnSort
            sortDirection={column.getIsSorted()}
            onSort={desc => column.toggleSorting(desc)}
            onClearSort={() => column.clearSorting()}
          />
        </div>
      ),
      cell: ({ row }) => {
        const size = row.original.fileSize;
        return formatFileSize(size);
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <div className='flex items-center gap-1'>
          <span>创建时间</span>
          <DataTableColumnSort
            sortDirection={column.getIsSorted()}
            onSort={desc => column.toggleSorting(desc)}
            onClearSort={() => column.clearSorting()}
          />
        </div>
      ),
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        return formatDate(createdAt);
      }
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        return (
          <RowActions
            row={row.original}
            onRefresh={onRefresh}
          />
        );
      }
    }
  ];
  return columns;
};

export default getColumns;
