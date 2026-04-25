import z from 'zod';

const baseSchema = z.object({
  name: z.string().trim().min(1, '系列名称不能为空')
});

export const seriesSchema = baseSchema;

export type SeriesFormValues = z.infer<typeof seriesSchema>;
