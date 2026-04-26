import { updateScore, type ScoreListItem } from '@/apis';
import ScoreForm from '@/pages/scores/score-form';
import { scoreSchema, type ScoreFormValues } from '@/pages/scores/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const EditDialog = createFormDialog<ScoreFormValues>({
  schema: scoreSchema,
  api: updateScore,
  FormComponent: ScoreForm,
  title: '编辑',
  triggerText: '编辑',
  triggerVariant: 'link',
  triggerSize: 'link'
});

interface EditDialogProps {
  row: ScoreListItem;
  onRefresh: () => void;
}

const ScoreEditDialog: React.FC<EditDialogProps> = ({ row, onRefresh }) => (
  <EditDialog
    onRefresh={onRefresh}
    values={{
      status: String(row.status) as 'true' | 'false'
    }}
    transformSubmit={values => ({
      id: row.id,
      status: values.status === 'true'
    })}
  />
);

export default ScoreEditDialog;
