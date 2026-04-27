import { updateFeedback, type FeedbackListItem } from '@/apis';
import FeedbackForm from '@/pages/feedbacks/feedback-form';
import {
  feedbackSchema,
  type FeedbackFormValues
} from '@/pages/feedbacks/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const EditDialog = createFormDialog<FeedbackFormValues>({
  schema: feedbackSchema,
  api: updateFeedback,
  FormComponent: FeedbackForm,
  title: '编辑',
  triggerText: '编辑',
  triggerVariant: 'link',
  triggerSize: 'link'
});

interface EditDialogProps {
  row: FeedbackListItem;
  onRefresh: () => void;
}

const FeedbackEditDialog: React.FC<EditDialogProps> = ({ row, onRefresh }) => (
  <EditDialog
    onRefresh={onRefresh}
    values={{
      status: row.status
    }}
    transformSubmit={values => ({
      id: row.id,
      status: values.status
    })}
  />
);

export default FeedbackEditDialog;
