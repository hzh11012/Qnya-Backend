import FormInput from '@/components/custom/form/form-input';
import FormTextarea from '@/components/custom/form/form-textarea';
import FormSelect from '@/components/custom/form/form-select';
import { Form } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import type { AppReleaseFormValues } from '@/pages/app-releases/form-schema';

const forceOptions = [
  { label: '普通更新（可跳过）', value: 'false' },
  { label: '强制更新（不可跳过）', value: 'true' }
];

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
            label='更新方式'
            control={form.control}
            name='force'
            options={forceOptions}
          />
        </div>
        <FormInput
          label='APK 下载地址'
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
