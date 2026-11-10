import z from 'zod';

/**
 * 发布平台选项（发布表单与列表列共用，value 与后端 app_platform 枚举一致）。
 * 当前仅发布 Android 安装包，其余平台就绪后直接在后台发版即可
 */
export const APP_PLATFORM_OPTIONS = [
  { label: 'Android', value: 'android' },
  { label: 'Windows', value: 'windows' },
  { label: 'iOS', value: 'ios' },
  { label: 'macOS', value: 'macos' }
] as const;

export type AppPlatformValue = (typeof APP_PLATFORM_OPTIONS)[number]['value'];

/** 平台 value → 展示名映射（列表渲染用） */
export const APP_PLATFORM_LABELS = Object.fromEntries(
  APP_PLATFORM_OPTIONS.map(({ value, label }) => [value, label])
) as Record<AppPlatformValue, string>;

/**
 * 发布表单：只填版本号（如 2.0.15），versionCode 由服务端自动递增维护；
 * 所有版本均为强制更新，客户端更新弹窗不可跳过
 */
export const appReleaseSchema = z.object({
  versionName: z.string().min(1, '版本号不能为空'),
  platform: z.enum(['android', 'windows', 'ios', 'macos']),
  url: z.string().min(1, '下载地址不能为空'),
  changelog: z.string().optional()
});

export type AppReleaseFormValues = z.infer<typeof appReleaseSchema>;
