import type { ResourcesListItem } from '@/apis';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatFileSize } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import RowActions from '@/pages/resources/row-actions';

const columns: ColumnDef<ResourcesListItem>[] = [
  {
    accessorKey: 'fansub',
    header: '来源',
    cell: ({ row }) => {
      const { fansub } = row.original;
      return <Badge>{fansub}</Badge>;
    }
  },
  {
    accessorKey: 'title',
    header: () => {
      return (
        <div className='flex items-center gap-1'>
          <span>资源名称</span>
          <Search className='size-3.5' />
        </div>
      );
    }
  },
  {
    accessorKey: 'size',
    header: '资源大小',
    cell: ({ row }) => {
      const size = row.original.size;
      return formatFileSize(size, 'kb');
    }
  },
  {
    accessorKey: 'createdAt',
    header: '发布时间',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return formatDate(createdAt);
    }
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => {
      return <RowActions row={row.original} />;
    }
  }
];

export default columns;
