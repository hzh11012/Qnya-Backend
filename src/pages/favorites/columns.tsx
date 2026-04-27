import type { FavoriteListItem } from '@/apis';
import { formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import RowActions from '@/pages/favorites/row-actions';
import DataTableColumnSort from '@/components/custom/data-table/data-table-column-sort';
import { DataTablePhotoView } from '@/components/custom/data-table/data-table-photo-view';

const getColumns = (onRefresh: () => void) => {
  const columns: ColumnDef<FavoriteListItem>[] = [
    {
      accessorKey: 'user.name',
      header: () => {
        return (
          <div className='flex items-center gap-1'>
            <span>用户名称</span>
            <Search className='size-3.5' />
          </div>
        );
      },
      cell: ({ row }) => {
        return row.original.user.name;
      }
    },
    {
      accessorKey: 'anime.name',
      header: '番剧名称',
      cell: ({ row }) => {
        const name = row.original.anime.name;
        const photos = [row.original.anime.cover];
        return (
          <DataTablePhotoView
            label={name}
            photos={photos}
          />
        );
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
