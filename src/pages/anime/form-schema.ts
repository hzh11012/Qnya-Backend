import z from 'zod';

const baseSchema = z.object({
  seriesId: z.string('番剧系列不能为空').trim().min(1, '番剧系列不能为空'),
  name: z.string().trim().min(1, '番剧名称不能为空'),
  season: z.number('所属季不能为空').min(0),
  seasonName: z
    .string('所属季名称不能为空')
    .trim()
    .min(1, '所属季名称不能为空'),
  remark: z.string().trim().min(1, '番剧简评不能为空'),
  description: z.string().trim().min(1, '番剧简介不能为空'),
  cover: z.string().trim().min(1, '番剧封面不能为空'),
  banner: z.string().trim().min(1, '番剧横幅不能为空'),
  status: z.enum(['draft', 'upcoming', 'airing', 'completed']),
  type: z.enum(['movie', 'japanese', 'american', 'chinese', 'adult']),
  year: z
    .number()
    .min(1990)
    .max(new Date().getFullYear() + 1),
  month: z.enum(['january', 'april', 'july', 'october']),
  tags: z.array(z.string()).min(1, '标签不能为空'),
  director: z.string().trim().min(1, '导演不能为空'),
  cv: z.string().trim().min(1, '声优不能为空')
});

export const animeSchema = baseSchema;

export type AnimeFormValues = z.infer<typeof animeSchema>;
