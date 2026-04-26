import { createTorrent } from '@/apis';
import AddForm from '@/pages/torrents/add-form';
import {
  torrentsSchema,
  type TorrentsFormValues
} from '@/pages/torrents/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const AddDialog = createFormDialog<TorrentsFormValues>({
  schema: torrentsSchema,
  api: createTorrent,
  FormComponent: AddForm,
  title: '新增',
  triggerText: '添加',
  onSuccessDelay: 150
});

interface AddDialogProps {
  disabled: boolean;
  onRefresh: () => void;
}

const TorrentsAddDialog: React.FC<AddDialogProps> = ({
  disabled,
  onRefresh
}) => (
  <AddDialog
    disabled={disabled}
    onRefresh={onRefresh}
    defaultValues={{ torrentUrl: '' }}
  />
);

export default TorrentsAddDialog;
