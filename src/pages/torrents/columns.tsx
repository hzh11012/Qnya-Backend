import type { TorrentsListItem } from '@/apis';
import DataTableColumnSort from '@/components/custom/data-table/data-table-column-sort';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDate, formatFileSize } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';

type QbitStatusType =
  | 'success'
  | 'warning'
  | 'destructive'
  | 'default'
  | 'muted';

interface QbitStatusConfig {
  label: string;
  type: QbitStatusType;
}

export const qbitStatusMap: Record<string, QbitStatusConfig> = {
  // 错误状态 - 红色 (destructive)
  'error': { label: '错误', type: 'destructive' },
  'missingFiles': { label: '文件丢失', type: 'destructive' },

  // 已完成/做种状态 - 绿色 (success)
  // UP 后缀 = 已下载完成，处于上传/做种阶段
  'uploading': { label: '做种中', type: 'success' },
  'pausedUP': { label: '已完成', type: 'success' }, // 下载完成，暂停做种
  'queuedUP': { label: '排队做种', type: 'success' }, // 下载完成，等待做种
  'stalledUP': { label: '做种等待', type: 'success' }, // 下载完成，无连接
  'checkingUP': { label: '校验中', type: 'success' }, // 下载完成，校验文件
  'forcedUP': { label: '强制做种', type: 'success' }, // 下载完成，强制做种

  // 下载状态 - 主体色 (default)
  'downloading': { label: '下载中', type: 'default' },
  'forcedDL': { label: '强制下载', type: 'default' },
  'metaDL': { label: '获取元数据', type: 'default' },
  'forcedMetaDL': { label: '强制获取元数据', type: 'default' },

  // 暂停/排队下载状态 - 黄色 (warning)
  // DL 后缀 = 还在下载阶段
  'pausedDL': { label: '已暂停', type: 'warning' }, // 下载未完成，已暂停
  'queuedDL': { label: '排队下载', type: 'warning' }, // 等待下载
  'stalledDL': { label: '等待连接', type: 'warning' }, // 下载中但无连接
  'checkingDL': { label: '校验中', type: 'warning' }, // 下载时校验

  // 其他状态 - 灰色 (muted)
  'allocating': { label: '分配空间', type: 'muted' },
  'checkingResumeData': { label: '检查数据', type: 'muted' },
  'moving': { label: '移动中', type: 'muted' },
  'unknown': { label: '未知', type: 'muted' }
};

const columns: ColumnDef<TorrentsListItem>[] = [
  {
    accessorKey: 'name',
    header: () => {
      return (
        <div className='flex items-center gap-1'>
          <span>种子名称</span>
          <Search className='size-3.5' />
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.name;
    }
  },
  {
    accessorKey: 'progress',
    header: '进度',
    cell: ({ row }) => {
      const progress = row.original.progress * 100;
      return (
        <Progress
          className='w-48'
          value={progress}
        />
      );
    }
  },
  {
    accessorKey: 'status',
    header: '状态',
    cell: ({ row }) => {
      const status = row.original.status;
      const config = qbitStatusMap[status] || {
        label: '未知',
        type: 'muted'
      };
      return <Badge variant={config.type}>{config.label}</Badge>;
    }
  },
  {
    accessorKey: 'size',
    header: ({ column }) => (
      <div className='flex items-center gap-1'>
        <span>选定大小</span>
        <DataTableColumnSort
          sortDirection={column.getIsSorted()}
          onSort={desc => column.toggleSorting(desc)}
          onClearSort={() => column.clearSorting()}
        />
      </div>
    ),
    cell: ({ row }) => {
      const size = row.original.size;
      return formatFileSize(size);
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <div className='flex items-center gap-1'>
        <span>下载时间</span>
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
  }
];

export default columns;
