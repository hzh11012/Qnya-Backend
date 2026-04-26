import z from 'zod';

export const scoreSchema = z.object({
  status: z.enum(['true', 'false'])
});

export type ScoreFormValues = z.infer<typeof scoreSchema>;
