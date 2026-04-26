import { Form } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import FormInput from '@/components/custom/form/form-input';
import type { SeriesFormValues } from '@/pages/series/form-schema';

interface AddFormProps {
  form: UseFormReturn<SeriesFormValues>;
  onSubmit: (values: SeriesFormValues) => void;
}

const AddForm: React.FC<AddFormProps> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput
          label='系列名称'
          control={form.control}
          maxLength={100}
          name='name'
        />
      </form>
    </Form>
  );
};

export default AddForm;
