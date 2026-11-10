import { updateAppRelease, type AppReleaseListItem } from '@/apis/app-releases';
import PublishForm from '@/pages/app-releases/publish-form';
import { appReleaseSchema } from '@/pages/app-releases/form-schema';
import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';

const EditDialog = createFormDialog({
  schema: appReleaseSchema,
  api: updateAppRelease,
  FormComponent: PublishForm,
  title: '编辑版本',
  triggerText: '编辑',
  triggerVariant: 'link',
  triggerSize: 'link',
  contentClassName: 'sm:max-w-lg'
});

interface EditDialogProps {
  row: AppReleaseListItem;
  onRefresh: () => void;
}

const AppReleaseEditDialog: React.FC<EditDialogProps> = ({
  row,
  onRefresh
}) => (
  <EditDialog
    onRefresh={onRefresh}
    values={{
      versionName: row.versionName,
      platform: row.platform,
      url: row.url,
      changelog: row.changelog
    }}
    transformSubmit={values => ({ ...values, id: row.id })}
  />
);

export default AppReleaseEditDialog;
