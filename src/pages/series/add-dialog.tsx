import { createSeries } from '@/apis';
import AddForm from '@/pages/series/add-form';
import {
  seriesSchema,
  type SeriesFormValues
} from '@/pages/series/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const AddDialog = createFormDialog<SeriesFormValues>({
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
