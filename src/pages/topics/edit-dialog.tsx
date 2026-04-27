import { updateTopic, type TopicListItem, type AnimeOptionRes } from '@/apis';
import TopicForm from '@/pages/topics/topic-form';
import { topicSchema, type TopicFormValues } from '@/pages/topics/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const EditDialog = createFormDialog<TopicFormValues>({
  schema: topicSchema,
  api: updateTopic,
  FormComponent: TopicForm,
  title: '编辑',
  triggerText: '编辑',
  triggerVariant: 'link',
  triggerSize: 'link',
  scrollable: true,
  contentClassName: 'px-0'
});

interface EditDialogProps {
  row: TopicListItem;
  onRefresh: () => void;
  animeOption: AnimeOptionRes;
}

const TopicEditDialog: React.FC<EditDialogProps> = ({
  row,
  onRefresh,
  animeOption
}) => (
  <EditDialog
    onRefresh={onRefresh}
    values={{
      name: row.name,
      description: row.description,
      status: String(row.status) as 'true' | 'false',
      cover: row.cover,
      animeIds: row.anime.map(item => String(item.id))
    }}
    transformSubmit={values => ({
      id: row.id,
      name: values.name,
      description: values.description,
      status: values.status === 'true',
      cover: values.cover,
      animeIds: values.animeIds?.map(Number)
    })}
    formProps={{ animeOption }}
  />
);

export default TopicEditDialog;
