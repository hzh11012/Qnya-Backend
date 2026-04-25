import type { TagsListItem } from '@/apis';
import { formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';

const columns: ColumnDef<TagsListItem>[] = [
  {
    accessorKey: 'name',
    header: () => {
      return (
        <div className='flex items-center gap-1'>
          <span>标签名称</span>
          <Search className='size-3.5' />
        </div>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: '创建时间',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return formatDate(createdAt);
    }
  }
];

export default columns;
