import z from 'zod';

export const videoSchema = z.object({
  animeId: z.string('番剧名称不能为空').trim().min(1, '番剧名称不能为空'),
  title: z.string().trim().min(1, '剧集标题不能为空'),
  episode: z.number('集数编号不能为空').min(0),
  url: z.string().trim().min(1, '剧集链接不能为空')
});

export type VideoFormValues = z.infer<typeof videoSchema>;
