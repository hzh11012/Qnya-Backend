import type { UserListItem } from '@/apis';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';
import EditDialog from '@/pages/users/edit-dialog';

const RowActions: React.FC<RowActionsProps<UserListItem>> = ({
  row,
  onRefresh
}) => {
  return (
    <div className='flex items-center gap-2'>
      <EditDialog
        row={row}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default RowActions;
