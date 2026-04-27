import z from 'zod';

export const topicSchema = z.object({
  name: z.string().trim().min(1, '专题名称不能为空'),
  description: z.string().trim().min(1, '专题描述不能为空'),
  status: z.enum(['true', 'false']),
  cover: z.string().trim().min(1, '专题封面不能为空'),
  animeIds: z.array(z.string()).optional()
});

export type TopicFormValues = z.infer<typeof topicSchema>;
