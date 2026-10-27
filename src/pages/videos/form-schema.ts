import z from 'zod';

export const videoSchema = z.object({
  animeId: z.string('番剧名称不能为空').trim().min(1, '番剧名称不能为空'),
  title: z.string().trim().min(1, '剧集标题不能为空'),
  episode: z
    .number('集数编号不能为空')
    .min(1, '集数编号不能小于 1')
    .multipleOf(0.5, '集数编号仅支持 0.5 的整数倍（如 6.5、12.5）'),
  url: z.string().trim().min(1, '剧集链接不能为空')
});

export type VideoFormValues = z.infer<typeof videoSchema>;
