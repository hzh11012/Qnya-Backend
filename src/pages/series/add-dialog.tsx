import { createSeries } from '@/apis/series';
import AddForm from '@/pages/series/add-form';
import { seriesSchema } from '@/pages/series/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const AddDialog = createFormDialog({
  schema: seriesSchema,
  api: createSeries,
  FormComponent: AddForm,
  title: '新增',
  triggerText: '添加'
});

interface AddDialogProps {
  disabled: boolean;
  onRefresh: () => void;
}

const SeriesAddDialog: React.FC<AddDialogProps> = ({ disabled, onRefresh }) => (
  <AddDialog
    disabled={disabled}
    onRefresh={onRefresh}
    defaultValues={{ name: '' }}
  />
);

export default SeriesAddDialog;
