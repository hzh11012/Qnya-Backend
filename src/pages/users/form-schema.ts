import z from 'zod';

export const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '用户名不能为空')
    .max(255, '用户名不能超过255个字符'),
  role: z.enum(['admin', 'premium', 'user', 'guest']),
  status: z.enum(['true', 'false'])
});

export type UserFormValues = z.infer<typeof userSchema>;
