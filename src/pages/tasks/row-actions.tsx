import { deleteTask, type TasksListItem } from '@/apis';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';
import IngestDialog from '@/pages/tasks/ingest-dialog';

const DeleteDialog = createActionDialog({
  api: deleteTask,
  text: '删除',
  title: '删除记录',
  description: '此操作将删除该条记录。 请确认是否继续?',
  className: 'text-destructive'
});

const RowActions: React.FC<RowActionsProps<TasksListItem>> = ({
  row,
  onRefresh
}) => {
  const { id, status } = row;

  return (
    <div className='flex items-center gap-2'>
      {status === 'pending' && (
        <IngestDialog
          id={id}
          onRefresh={onRefresh}
        />
      )}
      <DeleteDialog
        id={id}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default RowActions;
