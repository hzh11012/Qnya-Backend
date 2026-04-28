import { deleteDanmaku, type DanmakuListItem } from '@/apis';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';

const DeleteDialog = createActionDialog({
  api: deleteDanmaku,
  text: '删除',
  title: '删除弹幕',
  description: '此操作将删除该条弹幕记录。 请确认是否继续?',
  className: 'text-destructive'
});

const RowActions: React.FC<RowActionsProps<DanmakuListItem>> = ({
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
