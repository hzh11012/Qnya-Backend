import { Form } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import type { AnimeFormValues } from '@/pages/anime/form-schema';
import FormInput from '@/components/custom/form/form-input';
import FormCombobox from '@/components/custom/form/form-combobox';
import type { SeriesOptionRes, TagsOptionRes } from '@/apis';
import FormNumber from '@/components/custom/form/form-number';
import FormTextarea from '@/components/custom/form/form-textarea';
import FormSelect from '@/components/custom/form/form-select';
import FormMultiSelect from '@/components/custom/form/form-multiple-select';
import { months, status, types } from '@/pages/anime/columns';
import TmdbSearchDialog from '@/pages/anime/tmdb-search-dialog';
import type { ScrapeDetailResult } from '@/apis/anime';

interface AnimeFormProps {
  form: UseFormReturn<AnimeFormValues>;
  onSubmit: (values: AnimeFormValues) => void;
  seriesOption: SeriesOptionRes;
  tagsOption: TagsOptionRes;
}

const AnimeForm: React.FC<AnimeFormProps> = ({
  form,
  onSubmit,
  seriesOption,
  tagsOption
}) => {
  const handleTmdbSelect = (detail: ScrapeDetailResult) => {
    if (detail.name) form.setValue('name', detail.name);
    if (detail.description) form.setValue('description', detail.description);
    if (detail.cover) form.setValue('cover', detail.cover);
    if (detail.banner) form.setValue('banner', detail.banner);
    if (detail.status) form.setValue('status', detail.status);
    if (detail.type) form.setValue('type', detail.type);
    if (detail.year) form.setValue('year', detail.year);
    if (detail.month) form.setValue('month', detail.month);
    if (detail.director) form.setValue('director', detail.director);
    if (detail.cv) form.setValue('cv', detail.cv);
  };

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex items-end gap-2'>
          <div className='flex-1'>
            <FormInput
              label='番剧名称'
              control={form.control}
              maxLength={100}
              name='name'
            />
          </div>
          <TmdbSearchDialog onSelect={handleTmdbSelect} />
        </div>
        <FormCombobox
          label='番剧系列'
          control={form.control}
          name='seriesId'
          options={seriesOption}
        />
        <div className='grid grid-cols-2 gap-6 items-start'>
          <FormNumber
            label='所属季'
            control={form.control}
            name='season'
            maxValue={100}
          />
          <FormInput
            label='所属季名称'
            control={form.control}
            maxLength={25}
            name='seasonName'
          />
        </div>
        <FormInput
          label='番剧简评'
          control={form.control}
          maxLength={25}
          name='remark'
        />
        <FormTextarea
          label='番剧简介'
          control={form.control}
          maxLength={1000}
          name='description'
        />
        <FormTextarea
          label='番剧封面'
          control={form.control}
          maxLength={255}
          name='cover'
        />
        <FormTextarea
          label='番剧横幅'
          control={form.control}
          maxLength={255}
          name='banner'
        />
        <div className='grid grid-cols-2 gap-6 items-start'>
          <FormSelect
            label='状态'
            control={form.control}
            name='status'
            options={status}
          />
          <FormSelect
            label='类型'
            control={form.control}
            name='type'
            options={types}
          />
        </div>
        <div className='grid grid-cols-2 gap-6 items-start'>
          <FormNumber
            label='发行年份'
            control={form.control}
            name='year'
            maxValue={new Date().getFullYear() + 1}
          />
          <FormSelect
            label='发行月份'
            control={form.control}
            name='month'
            options={months}
          />
        </div>
        <FormMultiSelect
          label='标签'
          control={form.control}
          name='tags'
          options={tagsOption}
        />
        <FormInput
          label='导演'
          control={form.control}
          maxLength={25}
          name='director'
        />
        <FormTextarea
          label='声优'
          control={form.control}
          maxLength={1000}
          name='cv'
        />
      </form>
    </Form>
  );
};

export default AnimeForm;
