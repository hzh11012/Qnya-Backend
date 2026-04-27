import type { TopicListItem, AnimeOptionRes } from '@/apis';
import { createMap, formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import RowActions from '@/pages/topics/row-actions';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';
import DataTableColumnSort from '@/components/custom/data-table/data-table-column-sort';
import { DataTableArrayTooltip } from '@/components/custom/data-table/data-table-array-tooltip';
import { DataTableTextTooltip } from '@/components/custom/data-table/data-table-text-tooltip';

export const statusOptions = [
  { label: '已上架', value: 'true' },
  { label: '已下架', value: 'false' }
];

const statusMap = createMap(statusOptions);

const getColumns = (onRefresh: () => void, animeOption: AnimeOptionRes) => {
  const columns: ColumnDef<TopicListItem>[] = [
    {
      accessorKey: 'name',
      header: () => {
        return (
          <div className='flex items-center gap-1'>
            <span>专题名称</span>
            <Search className='size-3.5' />
          </div>
        );
      }
    },
    {
      accessorKey: 'description',
      header: '专题简介',
      cell: ({ row }) => {
        const text = row.original.description;
        return <DataTableTextTooltip text={text} />;
      }
    },
    {
      accessorKey: 'anime',
      header: '关联动漫',
      cell: ({ row }) => {
        const names = row.original.anime.map(item => item.name);
        return <DataTableArrayTooltip items={names} />;
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        const facets = column.getFacetedUniqueValues();
        const filterValue = (column.getFilterValue() as string[]) ?? [];
        return (
          <div className='flex items-center gap-1'>
            <span>专题状态</span>
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
            animeOption={animeOption}
          />
        );
      }
    }
  ];
  return columns;
};

export default getColumns;
