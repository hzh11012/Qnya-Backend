import { useQuery } from '@tanstack/react-query';
import { fetchAnimeOptions } from '@/apis/anime';
import { fetchSeriesOptions } from '@/apis/series';
import { fetchTagsOptions } from '@/apis/tags';
import type { AnimeOptionRes } from '@/apis/anime';
import type { SeriesOptionRes } from '@/apis/series';
import type { TagsOptionRes } from '@/apis/tags';

/**
 * 下拉选项数据源（TanStack Query 缓存）
 *
 * 选项变化少、且被多个页面共享（anime/topics/videos 都需要番剧选项），
 * 用稳定的 queryKey 让各页面命中同一份缓存，避免重复请求。
 * 保鲜期 5 分钟（全局默认 30s 是针对列表数据的）。
 */
const OPTIONS_STALE_TIME = 5 * 60_000;

export const useAnimeOptions = (): AnimeOptionRes => {
  const { data } = useQuery({
    queryKey: ['options', 'anime'],
    queryFn: fetchAnimeOptions,
    staleTime: OPTIONS_STALE_TIME
  });
  return data ?? [];
};

export const useSeriesOptions = (): SeriesOptionRes => {
  const { data } = useQuery({
    queryKey: ['options', 'series'],
    queryFn: fetchSeriesOptions,
    staleTime: OPTIONS_STALE_TIME
  });
  return data ?? [];
};

export const useTagsOptions = (): TagsOptionRes => {
  const { data } = useQuery({
    queryKey: ['options', 'tags'],
    queryFn: fetchTagsOptions,
    staleTime: OPTIONS_STALE_TIME
  });
  return data ?? [];
};
