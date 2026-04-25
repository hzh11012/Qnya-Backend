import React from 'react';
import { Form } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import FormTextarea from '@/components/custom/form/form-textarea';
import type { TorrentsFormValues } from '@/pages/torrents/form-schema';

interface AddFormProps {
  form: UseFormReturn<TorrentsFormValues>;
  onSubmit: (values: TorrentsFormValues) => void;
}

const AddForm: React.FC<AddFormProps> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormTextarea
          label='种子链接'
          control={form.control}
          name='torrentUrl'
        />
      </form>
    </Form>
  );
};

export default AddForm;
