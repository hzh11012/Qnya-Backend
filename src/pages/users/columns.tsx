import type { UserListItem } from '@/apis';
import { createMap, formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import RowActions from '@/pages/users/row-actions';
import { DataTableColumnFilter } from '@/components/custom/data-table/data-table-column-filter';
import DataTableColumnSort from '@/components/custom/data-table/data-table-column-sort';

export const roles = [
  { label: '管理员', value: 'admin' },
  { label: '高级用户', value: 'premium' },
  { label: '普通用户', value: 'user' },
  { label: '游客', value: 'guest' }
];

export const statusOptions = [
  { label: '启用', value: 'true' },
  { label: '禁用', value: 'false' }
];

const rolesMap = createMap(roles);

const getColumns = (onRefresh: () => void) => {
  const columns: ColumnDef<UserListItem>[] = [
    {
      accessorKey: 'name',
      header: () => {
        return (
          <div className='flex items-center gap-1'>
            <span>用户名</span>
            <Search className='size-3.5' />
          </div>
        );
      }
    },
    {
      accessorKey: 'email',
      header: '邮箱'
    },
    {
      accessorKey: 'role',
      header: ({ column }) => {
        const facets = column.getFacetedUniqueValues();
        const filterValue = (column.getFilterValue() as string[]) ?? [];
        return (
          <div className='flex items-center gap-1'>
            <span>角色</span>
            <DataTableColumnFilter
              facets={facets}
              filterValue={filterValue}
              options={roles}
              onFilterChange={val => column.setFilterValue(val)}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return rolesMap[row.original.role];
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
        return row.original.status ? '启用' : '禁用';
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
          />
        );
      }
    }
  ];
  return columns;
};

export default getColumns;
