import { updateWatchRoom, type WatchRoomListItem } from '@/apis/watch-rooms';
import WatchRoomForm from '@/pages/watch-rooms/room-form';
import { watchRoomSchema } from '@/pages/watch-rooms/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const EditDialog = createFormDialog({
  schema: watchRoomSchema,
  api: updateWatchRoom,
  FormComponent: WatchRoomForm,
  title: '编辑房间',
  triggerText: '编辑',
  triggerVariant: 'link',
  triggerSize: 'link',
  scrollable: true,
  contentClassName: 'px-0'
});

interface EditDialogProps {
  row: WatchRoomListItem;
  onRefresh: () => void;
}

const WatchRoomEditDialog: React.FC<EditDialogProps> = ({ row, onRefresh }) => (
  <EditDialog
    onRefresh={onRefresh}
    values={{
      name: row.name,
      announcement: row.announcement ?? ''
    }}
    transformSubmit={values => ({
      roomId: row.id,
      name: values.name,
      announcement: values.announcement
    })}
  />
);

export default WatchRoomEditDialog;
