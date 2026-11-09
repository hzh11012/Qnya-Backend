import z from 'zod';

/**
 * 发布表单：只填版本号（如 2.0.15），versionCode 由服务端自动递增维护；
 * force 用字符串枚举承载（Select 的 value 是 string），
 * 提交前由 PublishDialog 的 transformSubmit 转回 boolean
 */
export const appReleaseSchema = z.object({
  versionName: z.string().min(1, '版本号不能为空'),
  url: z.string().min(1, '下载地址不能为空'),
  changelog: z.string().optional(),
  force: z.enum(['true', 'false'])
});

export type AppReleaseFormValues = z.infer<typeof appReleaseSchema>;
