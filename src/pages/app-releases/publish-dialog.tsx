import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';
import { createAppRelease } from '@/apis/app-releases';
import PublishForm from '@/pages/app-releases/publish-form';
import { appReleaseSchema } from '@/pages/app-releases/form-schema';

/**
 * 发布新版本弹窗。所有版本均为强制更新，客户端更新弹窗不可跳过
 */
const PublishDialog = createFormDialog({
  schema: appReleaseSchema,
  api: createAppRelease,
  FormComponent: PublishForm,
  title: '发布新版本',
  triggerText: '发布新版本',
  contentClassName: 'sm:max-w-lg'
});

const AppReleasePublishDialog: React.FC<{ onRefresh: () => void }> = ({
  onRefresh
}) => (
  <PublishDialog
    onRefresh={onRefresh}
    defaultValues={{
      versionName: '',
      platform: 'android',
      url: '',
      changelog: ''
    }}
    transformSubmit={values => ({
      versionName: values.versionName,
      platform: values.platform,
      url: values.url,
      changelog: values.changelog ?? ''
    })}
  />
);

export default AppReleasePublishDialog;
