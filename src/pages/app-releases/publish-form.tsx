import FormInput from '@/components/custom/form/form-input';
import FormTextarea from '@/components/custom/form/form-textarea';
import FormSelect from '@/components/custom/form/form-select';
import { Form } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import {
  APP_PLATFORM_OPTIONS,
  type AppReleaseFormValues
} from '@/pages/app-releases/form-schema';

interface PublishFormProps {
  form: UseFormReturn<AppReleaseFormValues>;
  onSubmit: (values: AppReleaseFormValues) => void;
}

const PublishForm: React.FC<PublishFormProps> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='grid grid-cols-2 gap-4'>
          <FormInput
            label='版本号'
            control={form.control}
            name='versionName'
            maxLength={32}
          />
          <FormSelect
            label='目标平台'
            control={form.control}
            name='platform'
            options={[...APP_PLATFORM_OPTIONS]}
          />
        </div>
        <FormInput
          label='下载地址'
          control={form.control}
          name='url'
          maxLength={500}
        />
        <FormTextarea
          label='更新日志'
          control={form.control}
          name='changelog'
          maxLength={2000}
        />
      </form>
    </Form>
  );
};

export default PublishForm;
