import { updateVideo, type VideoListItem, type AnimeOptionRes } from '@/apis';
import VideoForm from '@/pages/videos/video-form';
import { videoSchema, type VideoFormValues } from '@/pages/videos/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const EditDialog = createFormDialog<VideoFormValues>({
  schema: videoSchema,
  api: updateVideo,
  FormComponent: VideoForm,
  title: '编辑',
  triggerText: '编辑',
  triggerVariant: 'link',
  triggerSize: 'link'
});

interface EditDialogProps {
  row: VideoListItem;
  onRefresh: () => void;
  animeOptions: AnimeOptionRes;
}

const VideoEditDialog: React.FC<EditDialogProps> = ({
  row,
  onRefresh,
  animeOptions
}) => (
  <EditDialog
    onRefresh={onRefresh}
    values={{
      animeId: String(row.animeId),
      title: row.title,
      episode: row.episode,
      url: row.url
    }}
    transformSubmit={values => ({
      ...values,
      animeId: Number(values.animeId),
      id: row.id
    })}
    formProps={{ animeOptions }}
  />
);

export default VideoEditDialog;
