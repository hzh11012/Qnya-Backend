import { Form } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import type { FeedbackFormValues } from '@/pages/feedbacks/form-schema';
import FormSelect from '@/components/custom/form/form-select';
import { statusOptions } from '@/pages/feedbacks/columns';

interface FeedbackFormProps {
  form: UseFormReturn<FeedbackFormValues>;
  onSubmit: (values: FeedbackFormValues) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormSelect
          label='问题反馈状态'
          control={form.control}
          name='status'
          options={statusOptions}
        />
      </form>
    </Form>
  );
};

export default FeedbackForm;
