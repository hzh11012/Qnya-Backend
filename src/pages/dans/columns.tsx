import type { DanmakuListItem } from '@/apis';
import { formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import RowActions from '@/pages/dans/row-actions';
import DataTableColumnSort from '@/components/custom/data-table/data-table-column-sort';
import { DataTableTextTooltip } from '@/components/custom/data-table/data-table-text-tooltip';
import DataTableColor from '@/components/custom/data-table/data-table-color';

const modeMap: Record<string, string> = {
  scroll: '滚动弹幕',
  top: '顶部弹幕',
  bottom: '底部弹幕'
};

const getColumns = (onRefresh: () => void) => {
  const columns: ColumnDef<DanmakuListItem>[] = [
    {
      accessorKey: 'user.name',
      header: '用户名称'
    },
    {
      accessorKey: 'text',
      header: () => (
        <div className='flex items-center gap-1'>
          <span>弹幕内容</span>
          <Search className='size-3.5' />
        </div>
      ),
      cell: ({ row }) => <DataTableTextTooltip text={row.original.text} />
    },
    {
      accessorKey: 'color',
      header: '颜色',
      cell: ({ row }) => <DataTableColor color={row.original.color} />
    },
    {
      accessorKey: 'mode',
      header: '类型',
      cell: ({ row }) => modeMap[row.original.mode] ?? row.original.mode
    },
    {
      accessorKey: 'time',
      header: '时间点'
    },
    {
      accessorKey: 'anime.name',
      header: '关联番剧'
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
      cell: ({ row }) => formatDate(row.original.createdAt)
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <RowActions
          row={row.original}
          onRefresh={onRefresh}
        />
      )
    }
  ];
  return columns;
};

export default getColumns;
