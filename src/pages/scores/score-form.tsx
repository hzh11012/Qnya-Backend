import { Form } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import type { ScoreFormValues } from '@/pages/scores/form-schema';
import FormSelect from '@/components/custom/form/form-select';
import { statusOptions } from '@/pages/scores/columns';

interface ScoreFormProps {
  form: UseFormReturn<ScoreFormValues>;
  onSubmit: (values: ScoreFormValues) => void;
}

const ScoreForm: React.FC<ScoreFormProps> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormSelect
          label='状态'
          control={form.control}
          name='status'
          options={statusOptions}
        />
      </form>
    </Form>
  );
};

export default ScoreForm;
