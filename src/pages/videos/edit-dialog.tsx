import { updateVideo, type VideoListItem } from '@/apis/videos';
import type { AnimeOptionRes } from '@/apis/anime';
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
      // animeId 为 UUID 字符串，不能转数字（转出 NaN 会被序列化成 null）
      id: row.id
    })}
    formProps={{ animeOptions }}
  />
);

export default VideoEditDialog;
