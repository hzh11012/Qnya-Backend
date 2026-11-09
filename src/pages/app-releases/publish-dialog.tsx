import { createFormDialog } from '@/components/custom/data-table/create-form-dialog';
import { createAppRelease } from '@/apis/app-releases';
import PublishForm from '@/pages/app-releases/publish-form';
import { appReleaseSchema } from '@/pages/app-releases/form-schema';

/**
 * 发布新版本弹窗。
 * force 表单值为字符串枚举，提交前转回 boolean（后端 zod 要求 boolean）
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
      url: '',
      changelog: '',
      force: 'false'
    }}
    transformSubmit={values => ({
      versionName: values.versionName,
      url: values.url,
      changelog: values.changelog ?? '',
      force: values.force === 'true'
    })}
  />
);

export default AppReleasePublishDialog;
