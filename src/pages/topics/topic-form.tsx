import { Form } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import type { TopicFormValues } from '@/pages/topics/form-schema';
import type { AnimeOptionRes } from '@/apis';
import FormInput from '@/components/custom/form/form-input';
import FormTextarea from '@/components/custom/form/form-textarea';
import FormSelect from '@/components/custom/form/form-select';
import FormMultiSelect from '@/components/custom/form/form-multiple-select';
import { statusOptions } from '@/pages/topics/columns';

interface TopicFormProps {
  form: UseFormReturn<TopicFormValues>;
  onSubmit: (values: TopicFormValues) => void;
  animeOption: AnimeOptionRes;
}

const TopicForm: React.FC<TopicFormProps> = ({
  form,
  onSubmit,
  animeOption
}) => {
  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='grid grid-cols-2 gap-6 items-start'>
          <FormInput
            label='专题名称'
            control={form.control}
            maxLength={50}
            name='name'
          />
          <FormSelect
            label='专题状态'
            control={form.control}
            name='status'
            options={statusOptions}
          />
        </div>
        <FormMultiSelect
          label='关联动漫'
          control={form.control}
          name='animeIds'
          options={animeOption}
        />
        <FormTextarea
          label='专题封面'
          control={form.control}
          maxLength={255}
          name='cover'
        />
        <FormTextarea
          label='专题简介'
          control={form.control}
          name='description'
        />
      </form>
    </Form>
  );
};

export default TopicForm;
