import type { TasksListItem } from '@/apis';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatFileSize } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import RowActions from '@/pages/tasks/row-actions';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

type TaskStatusType =
  | 'success'
  | 'warning'
  | 'destructive'
  | 'default'
  | 'muted';

interface TaskStatusConfig {
  label: string;
  type: TaskStatusType;
}

export const taskStatusMap: Record<string, TaskStatusConfig> = {
  'pending': { label: '待处理', type: 'muted' },
  'transcoding': { label: '转码中', type: 'default' },
  'transcoded': { label: '转码完成', type: 'warning' },
  'completed': { label: '已完成', type: 'success' },
  'failed': { label: '失败', type: 'destructive' }
};

const getColumns = (onRefresh: () => void) => {
  const columns: ColumnDef<TasksListItem>[] = [
    {
      accessorKey: 'filename',
      header: () => {
        return (
          <div className='flex items-center gap-1'>
            <span>文件名称</span>
            <Search className='size-3.5' />
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const { status, transcodeProgress, errorMessage } = row.original;
        const config = taskStatusMap[status];
        if (status === 'transcoding' || status === 'failed') {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={config.type}>{config.label}</Badge>
              </TooltipTrigger>
              <TooltipContent className='max-w-80'>
                {status === 'transcoding' ? (
                  <Progress
                    className='w-48'
                    value={transcodeProgress}
                  />
                ) : (
                  errorMessage
                )}
              </TooltipContent>
            </Tooltip>
          );
        }

        return <Badge variant={config.type}>{config.label}</Badge>;
      }
    },
    {
      accessorKey: 'fileSize',
      header: '资源大小',
      cell: ({ row }) => {
        const size = row.original.fileSize;
        return formatFileSize(size);
      }
    },
    {
      accessorKey: 'createdAt',
      header: '创建时间',
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
