import z from 'zod';

export const watchRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '房间名称不能为空')
    .max(100, '房间名称最多 100 字'),
  announcement: z.string().trim().max(500, '公告最多 500 字')
});

export type WatchRoomFormValues = z.infer<typeof watchRoomSchema>;
