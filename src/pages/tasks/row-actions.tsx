import React from 'react';
import {
  startTranscode,
  cancelTranscode,
  deleteTask,
  type TasksListItem,
  retryTask
} from '@/apis';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';

interface RowActionsProps<T> {
  row: T;
  onRefresh: () => void;
}

const TranscodeDialog = createActionDialog({
  api: startTranscode,
  text: '转码',
  title: '确认转码',
  description: '此操作将启动ffmpeg进行转码。 请确认是否继续?'
});

const CancelTranscodeDialog = createActionDialog({
  api: cancelTranscode,
  text: '取消转码',
  title: '取消转码',
  description: '此操作将取消ffmpeg转码。 请确认是否继续?'
});

const DeleteDialog = createActionDialog({
  api: deleteTask,
  text: '删除',
  title: '删除记录',
  description: '此操作将删除该条记录。 请确认是否继续?',
  className: 'text-destructive'
});

const RetryDialog = createActionDialog({
  api: retryTask,
  text: '重试',
  title: '重试转码',
  description: '此操作将重新启动ffmpeg进行转码。 请确认是否继续?'
});

const ScrapeAnimeDialog: React.FC = () => {
  return <div>刮削（TODO）</div>;
};

const RowActions: React.FC<RowActionsProps<TasksListItem>> = ({
  row,
  onRefresh
}) => {
  const { id, status } = row;

  return (
    <div className='flex items-center gap-2'>
      {status === 'pending' && (
        <TranscodeDialog
          id={id}
          onRefresh={onRefresh}
        />
      )}
      {status === 'transcoding' && (
        <CancelTranscodeDialog
          id={id}
          onRefresh={onRefresh}
        />
      )}
      {status === 'failed' && (
        <RetryDialog
          id={id}
          onRefresh={onRefresh}
        />
      )}
      {status === 'transcoded' && <ScrapeAnimeDialog />}
      {status !== 'transcoding' && (
        <DeleteDialog
          id={id}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};

export default RowActions;
