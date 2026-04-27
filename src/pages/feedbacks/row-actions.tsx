import { deleteFeedback, type FeedbackListItem } from '@/apis';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';
import EditDialog from '@/pages/feedbacks/edit-dialog';

const DeleteDialog = createActionDialog({
  api: deleteFeedback,
  text: '删除',
  title: '删除反馈',
  description: '此操作将删除该条反馈记录。 请确认是否继续?',
  className: 'text-destructive'
});

const RowActions: React.FC<RowActionsProps<FeedbackListItem>> = ({
  row,
  onRefresh
}) => {
  const { id } = row;

  return (
    <div className='flex items-center gap-2'>
      <EditDialog
        row={row}
        onRefresh={onRefresh}
      />
      <DeleteDialog
        id={id}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default RowActions;
