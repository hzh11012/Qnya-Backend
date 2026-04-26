import { Form } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import type { UserFormValues } from '@/pages/users/form-schema';
import FormInput from '@/components/custom/form/form-input';
import FormSelect from '@/components/custom/form/form-select';
import { roles, statusOptions } from '@/pages/users/columns';

interface UserFormProps {
  form: UseFormReturn<UserFormValues>;
  onSubmit: (values: UserFormValues) => void;
}

const UserForm: React.FC<UserFormProps> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          label='用户名'
          control={form.control}
          maxLength={255}
          name='name'
        />
        <FormSelect
          label='角色'
          control={form.control}
          name='role'
          options={roles}
        />
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

export default UserForm;
