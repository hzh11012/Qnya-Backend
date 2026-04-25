import React from 'react';
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
  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          label='番剧名称'
          control={form.control}
          maxLength={100}
          name='name'
        />
        <FormCombobox
          label='番剧系列'
          control={form.control}
          name='seriesId'
          options={seriesOption}
        />
        <div className='grid grid-cols-2 gap-6 items-start'>
          <FormNumber
            label='番剧所属季'
            control={form.control}
            name='season'
            maxValue={100}
          />
          <FormInput
            label='番剧所属季名称'
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
            label='番剧状态'
            control={form.control}
            name='status'
            options={status}
          />
          <FormSelect
            label='番剧类型'
            control={form.control}
            name='type'
            options={types}
          />
        </div>
        <div className='grid grid-cols-2 gap-6 items-start'>
          <FormNumber
            label='番剧发行年份'
            control={form.control}
            name='year'
            maxValue={new Date().getFullYear() + 1}
          />
          <FormSelect
            label='番剧发行月份'
            control={form.control}
            name='month'
            options={months}
          />
        </div>
        <FormMultiSelect
          label='番剧标签'
          control={form.control}
          name='tags'
          options={tagsOption}
        />
        <FormInput
          label='番剧导演'
          control={form.control}
          maxLength={25}
          name='director'
        />
        <FormTextarea
          label='番剧声优'
          control={form.control}
          maxLength={1000}
          name='cv'
        />
      </form>
    </Form>
  );
};

export default AnimeForm;
