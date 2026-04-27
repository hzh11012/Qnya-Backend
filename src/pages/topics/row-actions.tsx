import { deleteTopic, type TopicListItem, type AnimeOptionRes } from '@/apis';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';
import EditDialog from '@/pages/topics/edit-dialog';

interface TopicRowActionsProps extends RowActionsProps<TopicListItem> {
  animeOption: AnimeOptionRes;
}

const DeleteDialog = createActionDialog({
  api: deleteTopic,
  text: '删除',
  title: '删除专题',
  description: '此操作将删除该条专题推荐。 请确认是否继续?',
  className: 'text-destructive'
});

const RowActions: React.FC<TopicRowActionsProps> = ({
  row,
  onRefresh,
  animeOption
}) => {
  const { id } = row;

  return (
    <div className='flex items-center gap-2'>
      <EditDialog
        row={row}
        onRefresh={onRefresh}
        animeOption={animeOption}
      />
      <DeleteDialog
        id={id}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default RowActions;
