import { createVideo, type AnimeOptionRes } from '@/apis';
import VideoForm from '@/pages/videos/video-form';
import { videoSchema, type VideoFormValues } from '@/pages/videos/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const AddDialog = createFormDialog<VideoFormValues>({
  schema: videoSchema,
  api: createVideo,
  FormComponent: VideoForm,
  title: '新增',
  triggerText: '添加'
});

interface AddDialogProps {
  disabled: boolean;
  onRefresh: () => void;
  animeOptions: AnimeOptionRes;
}

const VideoAddDialog: React.FC<AddDialogProps> = ({
  disabled,
  onRefresh,
  animeOptions
}) => (
  <AddDialog
    disabled={disabled}
    onRefresh={onRefresh}
    defaultValues={{
      animeId: '',
      title: '',
      episode: 1,
      url: ''
    }}
    transformSubmit={values => ({ ...values, animeId: Number(values.animeId) })}
    formProps={{ animeOptions }}
  />
);

export default VideoAddDialog;
