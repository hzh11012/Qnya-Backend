import { updateUser, type UserListItem } from '@/apis';
import UserForm from '@/pages/users/user-form';
import { userSchema, type UserFormValues } from '@/pages/users/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const EditDialog = createFormDialog<UserFormValues>({
  schema: userSchema,
  api: updateUser,
  FormComponent: UserForm,
  title: '编辑',
  triggerText: '编辑',
  triggerVariant: 'link',
  triggerSize: 'link'
});

interface EditDialogProps {
  row: UserListItem;
  onRefresh: () => void;
}

const UserEditDialog: React.FC<EditDialogProps> = ({ row, onRefresh }) => (
  <EditDialog
    onRefresh={onRefresh}
    values={{
      name: row.name,
      role: row.role,
      status: String(row.status) as 'true' | 'false'
    }}
    transformSubmit={values => ({
      id: row.id,
      name: values.name,
      role: values.role,
      status: values.status === 'true'
    })}
  />
);

export default UserEditDialog;
