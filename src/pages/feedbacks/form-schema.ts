import z from 'zod';

export const feedbackSchema = z.object({
  status: z.enum(['pending', 'processing', 'done'])
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
