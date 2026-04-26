import { deleteFavorite, type FavoriteListItem } from '@/apis';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';

const DeleteDialog = createActionDialog({
  api: deleteFavorite,
  text: '删除',
  title: '删除追番',
  description: '此操作将删除该条追番记录。 请确认是否继续?',
  className: 'text-destructive'
});

const RowActions: React.FC<RowActionsProps<FavoriteListItem>> = ({
  row,
  onRefresh
}) => {
  const { id } = row;

  return (
    <DeleteDialog
      id={id}
      onRefresh={onRefresh}
    />
  );
};

export default RowActions;
