import { Form } from '@/components/ui/form';
import FormInput from '@/components/custom/form/form-input';
import FormNumber from '@/components/custom/form/form-number';
import FormCombobox from '@/components/custom/form/form-combobox';
import type { UseFormReturn } from 'react-hook-form';
import type { VideoFormValues } from '@/pages/videos/form-schema';
import type { AnimeOptionRes } from '@/apis';

interface VideoFormProps {
  form: UseFormReturn<VideoFormValues>;
  onSubmit: (values: VideoFormValues) => void;
  animeOptions: AnimeOptionRes;
}

const VideoForm: React.FC<VideoFormProps> = ({
  form,
  onSubmit,
  animeOptions
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4'
      >
        <FormCombobox
          control={form.control}
          name='animeId'
          label='番剧名称'
          options={animeOptions}
        />
        <div className='grid grid-cols-2 gap-6 items-start'>
          <FormInput
            control={form.control}
            name='title'
            label='剧集标题'
            maxLength={100}
          />
          <FormNumber
            control={form.control}
            name='episode'
            label='集数编号'
            minValue={1}
            maxValue={9999}
          />
        </div>
        <FormInput
          control={form.control}
          name='url'
          label='剧集链接'
          maxLength={255}
        />
      </form>
    </Form>
  );
};

export default VideoForm;
