import { deleteAppRelease, type AppReleaseListItem } from '@/apis/app-releases';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';
import AppReleaseEditDialog from '@/pages/app-releases/edit-dialog';

const DeleteDialog = createActionDialog({
  api: deleteAppRelease,
  text: '删除',
  title: '删除版本记录',
  description:
    '此操作将删除该条版本发布记录，客户端将回退到上一条记录。请确认是否继续?',
  className: 'text-destructive'
});

const RowActions: React.FC<RowActionsProps<AppReleaseListItem>> = ({
  row,
  onRefresh
}) => {
  return (
    <div className='flex items-center gap-2'>
      <AppReleaseEditDialog
        row={row}
        onRefresh={onRefresh}
      />
      <DeleteDialog
        id={row.id}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default RowActions;
