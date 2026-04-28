import type { VideoListItem, AnimeOptionRes } from '@/apis';
import { formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import RowActions from '@/pages/videos/row-actions';
import DataTableColumnSort from '@/components/custom/data-table/data-table-column-sort';
import { DataTablePhotoView } from '@/components/custom/data-table/data-table-photo-view';

const getColumns = (onRefresh: () => void, animeOptions: AnimeOptionRes) => {
  const columns: ColumnDef<VideoListItem>[] = [
    {
      accessorKey: 'anime.name',
      header: '番剧名称',
      cell: ({ row }) => {
        const { name, cover } = row.original.anime;
        return (
          <DataTablePhotoView
            label={name}
            photos={[cover]}
          />
        );
      }
    },
    {
      accessorKey: 'title',
      header: () => (
        <div className='flex items-center gap-1'>
          <span>剧集标题</span>
          <Search className='size-3.5' />
        </div>
      )
    },
    {
      accessorKey: 'url',
      header: '剧集链接'
    },
    {
      accessorKey: 'episode',
      header: ({ column }) => (
        <div className='flex items-center gap-1'>
          <span>集数编号</span>
          <DataTableColumnSort
            sortDirection={column.getIsSorted()}
            onSort={desc => column.toggleSorting(desc)}
            onClearSort={() => column.clearSorting()}
          />
        </div>
      )
    },
    {
      accessorKey: 'views',
      header: ({ column }) => (
        <div className='flex items-center gap-1'>
          <span>播放量</span>
          <DataTableColumnSort
            sortDirection={column.getIsSorted()}
            onSort={desc => column.toggleSorting(desc)}
            onClearSort={() => column.clearSorting()}
          />
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      meta: {
        title: '创建时间'
      },
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
          animeOptions={animeOptions}
        />
      )
    }
  ];

  return columns;
};

export default getColumns;
