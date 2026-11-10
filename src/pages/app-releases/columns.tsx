import type { AppReleaseListItem } from '@/apis/app-releases';
import { formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import RowActions from '@/pages/app-releases/row-actions';
import DataTableColumnSort from '@/components/custom/data-table/data-table-column-sort';
import { DataTableTextTooltip } from '@/components/custom/data-table/data-table-text-tooltip';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';
import {
  APP_PLATFORM_LABELS,
  APP_PLATFORM_OPTIONS
} from '@/pages/app-releases/form-schema';
import { Badge } from '@/components/ui/badge';

const getColumns = (onRefresh: () => void) => {
  const columns: ColumnDef<AppReleaseListItem>[] = [
    {
      accessorKey: 'versionName',
      header: '版本',
      cell: ({ row }) => (
        <span className='font-medium'>{row.original.versionName}</span>
      )
    },
    {
      accessorKey: 'platform',
      header: ({ column }) => {
        const facets = column.getFacetedUniqueValues();
        const filterValue = (column.getFilterValue() as string[]) ?? [];
        return (
          <div className='flex items-center gap-1'>
            <span>平台</span>
            <DataTableColumnFilter
              facets={facets}
              filterValue={filterValue}
              options={[...APP_PLATFORM_OPTIONS]}
              onFilterChange={val =>
                // 后端列表接口仅接受单个平台，收敛为单选（保留最后点选项）
                column.setFilterValue(
                  val?.length ? [val[val.length - 1]!] : undefined
                )
              }
            />
          </div>
        );
      },
      cell: ({ row }) => (
        <Badge>{APP_PLATFORM_LABELS[row.original.platform]}</Badge>
      )
    },
    {
      accessorKey: 'url',
      header: '下载地址',
      cell: ({ row }) => <DataTableTextTooltip text={row.original.url} />
    },
    {
      accessorKey: 'changelog',
      header: '更新日志',
      cell: ({ row }) =>
        row.original.changelog ? (
          <DataTableTextTooltip text={row.original.changelog} />
        ) : (
          <span className='text-muted-foreground'>-</span>
        )
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <div className='flex items-center gap-1'>
          <span>发布时间</span>
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
