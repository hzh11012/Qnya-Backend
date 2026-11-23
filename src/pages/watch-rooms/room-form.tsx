import { Form } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import type { WatchRoomFormValues } from '@/pages/watch-rooms/form-schema';
import FormInput from '@/components/custom/form/form-input';
import FormTextarea from '@/components/custom/form/form-textarea';

interface WatchRoomFormProps {
  form: UseFormReturn<WatchRoomFormValues>;
  onSubmit: (values: WatchRoomFormValues) => void;
}

const WatchRoomForm: React.FC<WatchRoomFormProps> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          label='房间名称'
          control={form.control}
          maxLength={100}
          name='name'
        />
        <FormTextarea
          label='房间公告'
          control={form.control}
          maxLength={500}
          name='announcement'
        />
      </form>
    </Form>
  );
};

export default WatchRoomForm;
