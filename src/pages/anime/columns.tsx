import type { AnimeListItem, SeriesOptionRes, TagsOptionRes } from '@/apis';
import { createMap, formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import RowActions from '@/pages/anime/row-actions';
import { DataTableTextTooltip } from '@/components/custom/data-table/data-table-text-tooltip';
import { DataTableArrayTooltip } from '@/components/custom/data-table/data-table-array-tooltip';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';
import DataTableColumnSort from '@/components/custom/data-table/data-table-column-sort';
import { DataTablePhotoView } from '@/components/custom/data-table/data-table-photo-view';

export const types = [
  { label: '剧场版', value: 'movie' },
  { label: '日番', value: 'japanese' },
  { label: '美番', value: 'american' },
  { label: '国番', value: 'chinese' },
  { label: '里番', value: 'adult' }
];

export const status = [
  { label: '草稿', value: 'draft' },
  { label: '即将开播', value: 'upcoming' },
  { label: '连载中', value: 'airing' },
  { label: '已完结', value: 'completed' }
];

export const years = Array.from(
  { length: new Date().getFullYear() - 1988 },
  (_, i) => {
    return { label: String(1990 + i), value: String(1990 + i) };
  }
).reverse();

export const months = [
  { label: '一月番', value: 'january' },
  { label: '四月番', value: 'april' },
  { label: '七月番', value: 'july' },
  { label: '十月番', value: 'october' }
];

const typesMap = createMap(types);
const statusMap = createMap(status);
const monthsMap = createMap(months);

const getColumns = (
  onRefresh: () => void,
  tagsOption: TagsOptionRes,
  seriesOption: SeriesOptionRes
) => {
  const columns: ColumnDef<AnimeListItem>[] = [
    {
      accessorKey: 'name',
      header: () => {
        return (
          <div className='flex items-center gap-1'>
            <span>番剧名称</span>
            <Search className='size-3.5' />
          </div>
        );
      },
      cell: ({ row }) => {
        const name = row.original.name;
        const photos = [row.original.cover, row.original.banner];
        return (
          <DataTablePhotoView
            label={name}
            photos={photos}
          />
        );
      }
    },
    {
      accessorKey: 'remark',
      header: '番剧简评'
    },
    {
      accessorKey: 'description',
      header: '番剧简介',
      cell: ({ row }) => {
        const text = row.original.description;
        return <DataTableTextTooltip text={text} />;
      }
    },
    {
      accessorKey: 'tags',
      header: ({ column }) => {
        const facets = column.getFacetedUniqueValues();
        const filterValue = (column.getFilterValue() as string[]) ?? [];
        return (
          <div className='flex items-center gap-1'>
            <span>标签</span>
            <DataTableColumnFilter
              facets={facets}
              filterValue={filterValue}
              options={tagsOption}
              onFilterChange={val => column.setFilterValue(val)}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const tags = row.original.tags.map(item => item.name);
        return <DataTableArrayTooltip items={tags} />;
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
              options={types}
              onFilterChange={val => column.setFilterValue(val)}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return typesMap[row.original.type];
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
              options={status}
              onFilterChange={val => column.setFilterValue(val)}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return statusMap[row.original.status];
      }
    },
    {
      accessorKey: 'year',
      header: ({ column }) => {
        const facets = column.getFacetedUniqueValues();
        const filterValue = (column.getFilterValue() as string[]) ?? [];
        return (
          <div className='flex items-center gap-1'>
            <span>发行年份</span>
            <DataTableColumnFilter
              facets={facets}
              filterValue={filterValue}
              options={years}
              onFilterChange={val => column.setFilterValue(val)}
            />
          </div>
        );
      }
    },
    {
      accessorKey: 'month',

      header: ({ column }) => {
        const facets = column.getFacetedUniqueValues();
        const filterValue = (column.getFilterValue() as string[]) ?? [];
        return (
          <div className='flex items-center gap-1'>
            <span>发行月份</span>
            <DataTableColumnFilter
              facets={facets}
              filterValue={filterValue}
              options={months}
              onFilterChange={val => column.setFilterValue(val)}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return monthsMap[row.original.month];
      }
    },
    {
      accessorKey: 'season',
      header: '所属季',
      cell: ({ row }) => {
        const season = row.original.seasonName || `第${row.original.season}季`;
        return season;
      }
    },
    {
      accessorKey: 'avgScore',
      header: '评分'
    },
    {
      accessorKey: 'scoreCount',
      header: '评分数'
    },
    {
      accessorKey: 'director',
      header: '导演'
    },
    {
      accessorKey: 'cv',
      header: '声优',
      cell: ({ row }) => {
        const text = row.original.cv;
        return <DataTableTextTooltip text={text} />;
      }
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
            seriesOption={seriesOption}
            tagsOption={tagsOption}
          />
        );
      }
    }
  ];
  return columns;
};

export default getColumns;
