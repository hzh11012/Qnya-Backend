import { createTopic, type AnimeOptionRes } from '@/apis';
import TopicForm from '@/pages/topics/topic-form';
import { topicSchema, type TopicFormValues } from '@/pages/topics/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const AddDialog = createFormDialog<TopicFormValues>({
  schema: topicSchema,
  api: createTopic,
  FormComponent: TopicForm,
  title: '新增',
  triggerText: '添加',
  scrollable: true,
  contentClassName: 'px-0'
});

interface AddDialogProps {
  disabled: boolean;
  onRefresh: () => void;
  animeOption: AnimeOptionRes;
}

const TopicAddDialog: React.FC<AddDialogProps> = ({
  disabled,
  onRefresh,
  animeOption
}) => (
  <AddDialog
    disabled={disabled}
    onRefresh={onRefresh}
    defaultValues={{
      name: '',
      description: '',
      status: 'true',
      cover: '',
      animeIds: []
    }}
    transformSubmit={values => ({
      name: values.name,
      description: values.description,
      status: values.status === 'true',
      cover: values.cover,
      animeIds: values.animeIds?.map(Number)
    })}
    formProps={{ animeOption }}
  />
);

export default TopicAddDialog;
