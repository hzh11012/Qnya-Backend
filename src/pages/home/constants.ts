import type { DashboardStatsResponse } from '@/apis/dashboard';

type AnimeStatusKey = keyof DashboardStatsResponse['content']['animeByStatus'];
type AnimeTypeKey = keyof DashboardStatsResponse['content']['animeByType'];
type UserRoleKey = keyof DashboardStatsResponse['users']['byRole'];

/** 番剧状态分布配色（堆叠条段 / 图例色点） */
export const STATUS_COLORS = {
  draft: 'bg-orange-500',
  upcoming: 'bg-blue-500',
  airing: 'bg-emerald-500',
  completed: 'bg-purple-500'
} satisfies Record<AnimeStatusKey, string>;

/** 番剧类型分布配色（条形图 / 图例色点） */
export const TYPE_COLORS = {
  japanese: 'bg-pink-500',
  chinese: 'bg-red-500',
  american: 'bg-blue-500',
  movie: 'bg-amber-500',
  adult: 'bg-violet-500'
} satisfies Record<AnimeTypeKey, string>;

/** 用户角色环形图描边色 */
export const ROLE_STROKES = {
  admin: 'stroke-red-500',
  premium: 'stroke-amber-500',
  user: 'stroke-blue-500',
  guest: 'stroke-teal-500'
} satisfies Record<UserRoleKey, string>;

/** 用户角色图例色点 */
export const ROLE_DOTS = {
  admin: 'bg-red-500',
  premium: 'bg-amber-500',
  user: 'bg-blue-500',
  guest: 'bg-teal-500'
} satisfies Record<UserRoleKey, string>;
