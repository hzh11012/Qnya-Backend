import type { FeedbackListItem } from '@/apis';
import { createMap, formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import RowActions from '@/pages/feedbacks/row-actions';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';
import DataTableColumnSort from '@/components/custom/data-table/data-table-column-sort';
import { DataTableTextTooltip } from '@/components/custom/data-table/data-table-text-tooltip';
import { DataTablePhotoView } from '@/components/custom/data-table/data-table-photo-view';

export const typeOptions = [
  { label: '咨询', value: 'consultation' },
  { label: '建议', value: 'suggestion' },
  { label: '投诉', value: 'complaint' },
  { label: '其他', value: 'other' }
];

export const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '处理中', value: 'processing' },
  { label: '已完成', value: 'done' }
];

const typeMap = createMap(typeOptions);
const statusMap = createMap(statusOptions);

const getColumns = (onRefresh: () => void) => {
  const columns: ColumnDef<FeedbackListItem>[] = [
    {
      accessorKey: 'user.name',
      header: '用户名称'
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
      accessorKey: 'type',
      header: ({ column }) => {
        const facets = column.getFacetedUniqueValues();
        const filterValue = (column.getFilterValue() as string[]) ?? [];
        return (
          <div className='flex items-center gap-1'>
            <span>类型</span>
            <DataTableColumnFilter
              facets={facets}
              filterValue={filterValue}
              options={typeOptions}
              onFilterChange={val => column.setFilterValue(val)}
            />
          </div>
        );
      },
      cell: ({ row }) => typeMap[row.original.type]
    },
    {
      accessorKey: 'content',
      header: () => (
        <div className='flex items-center gap-1'>
          <span>反馈内容</span>
          <Search className='size-3.5' />
        </div>
      ),
      cell: ({ row }) => <DataTableTextTooltip text={row.original.content} />
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
      cell: ({ row }) => statusMap[row.original.status]
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
