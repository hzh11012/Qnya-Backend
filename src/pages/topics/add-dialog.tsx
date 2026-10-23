import { createTopic } from '@/apis/topics';
import type { AnimeOptionRes } from '@/apis/anime';
import TopicForm from '@/pages/topics/topic-form';
import { topicSchema } from '@/pages/topics/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const AddDialog = createFormDialog({
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
      animeIds: values.animeIds
    })}
    formProps={{ animeOption }}
  />
);

export default TopicAddDialog;
