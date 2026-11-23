import { deleteWatchRoom, type WatchRoomListItem } from '@/apis/watch-rooms';
import { createActionDialog } from '@/components/custom/data-table/create-action-dialog';
import type { RowActionsProps } from '@/components/custom/data-table/create-form-dialog';
import DetailSheet from '@/pages/watch-rooms/detail-sheet';
import EditDialog from '@/pages/watch-rooms/edit-dialog';

const DeleteDialog = createActionDialog({
  api: ({ id }) => deleteWatchRoom({ roomId: id }),
  text: '删除',
  title: '删除放映室',
  description:
    '此操作将硬删除该房间及其全部成员记录、聊天与系统通知，开放中的房间会被立即解散。请确认是否继续?',
  className: 'text-destructive'
});

const RowActions: React.FC<RowActionsProps<WatchRoomListItem>> = ({
  row,
  onRefresh
}) => {
  return (
    <div className='flex items-center gap-2'>
      <DetailSheet row={row} />
      <EditDialog
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
