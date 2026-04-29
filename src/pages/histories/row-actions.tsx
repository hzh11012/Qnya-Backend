import { deleteHistory, type HistoryListItem } from '@/apis';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';

const DeleteDialog = createActionDialog({
  api: deleteHistory,
  text: '删除',
  title: '删除记录',
  description: '此操作将删除该条观看记录。 请确认是否继续?',
  className: 'text-destructive'
});

const RowActions: React.FC<RowActionsProps<HistoryListItem>> = ({
  row,
  onRefresh
}) => {
  const { id } = row;

  return (
    <div className='flex items-center gap-2'>
      <DeleteDialog
        id={id}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default RowActions;
