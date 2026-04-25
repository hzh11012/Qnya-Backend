import z from 'zod';

const baseSchema = z.object({
  torrentUrl: z.string().trim().min(1, '种子链接不能为空')
});

export const torrentsSchema = baseSchema;

export type TorrentsFormValues = z.infer<typeof torrentsSchema>;
