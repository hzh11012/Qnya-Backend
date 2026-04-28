import { deleteVideo, type VideoListItem, type AnimeOptionRes } from '@/apis';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';
import EditDialog from '@/pages/videos/edit-dialog';

interface VideoRowActionsProps extends RowActionsProps<VideoListItem> {
  animeOptions: AnimeOptionRes;
}

const DeleteDialog = createActionDialog({
  api: deleteVideo,
  text: '删除',
  title: '删除剧集',
  description: '此操作将删除该条剧集记录。请确认是否继续?',
  className: 'text-destructive'
});

const RowActions: React.FC<VideoRowActionsProps> = ({
  row,
  onRefresh,
  animeOptions
}) => {
  const { id } = row;

  return (
    <div className='flex items-center gap-2'>
      <EditDialog
        row={row}
        onRefresh={onRefresh}
        animeOptions={animeOptions}
      />
      <DeleteDialog
        id={id}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default RowActions;
