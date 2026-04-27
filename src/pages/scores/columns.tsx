import type { ScoreListItem } from '@/apis';
import { createMap, formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import RowActions from '@/pages/scores/row-actions';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';
import DataTableColumnSort from '@/components/custom/data-table/data-table-column-sort';
import { DataTablePhotoView } from '@/components/custom/data-table/data-table-photo-view';
import { DataTableTextTooltip } from '@/components/custom/data-table/data-table-text-tooltip';

export const statusOptions = [
  { label: '已审核', value: 'true' },
  { label: '待审核', value: 'false' }
];

const statusMap = createMap(statusOptions);

const getColumns = (onRefresh: () => void) => {
  const columns: ColumnDef<ScoreListItem>[] = [
    {
      accessorKey: 'user.name',
      header: () => {
        return (
          <div className='flex items-center gap-1'>
            <span>用户名称</span>
            <Search className='size-3.5' />
          </div>
        );
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
      accessorKey: 'score',
      header: '评分'
    },
    {
      accessorKey: 'content',
      header: '评价',
      cell: ({ row }) => {
        const text = row.original.content;
        return <DataTableTextTooltip text={text} />;
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
              options={statusOptions}
              onFilterChange={val => column.setFilterValue(val)}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return statusMap[String(row.original.status)];
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
