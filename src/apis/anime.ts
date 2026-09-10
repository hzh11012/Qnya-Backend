import request from '@/lib/request';
import type { ApiBody, ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type AnimeListParams = ApiQuery<'/api/admin/anime/'>;
type AnimeListRes = ApiData<'/api/admin/anime/'>;
type AnimeListItem = AnimeListRes['items'][number];
type AddAnimeBody = ApiBody<'/api/admin/anime/'>;
type EditAnimeBody = ApiPath<'/api/admin/anime/{id}', 'put'> &
  ApiBody<'/api/admin/anime/{id}', 'put'>;
type DeleteAnimeParams = ApiPath<'/api/admin/anime/{id}', 'delete'>;
type AnimeOptionRes = ApiData<'/api/admin/anime/options'>;
export type AnimeOptionItem = AnimeOptionRes[number];

const fetchAnimes = (params: AnimeListParams) => {
  return request.get<AnimeListRes>('/api/admin/anime', {
    params,
    showErrorToast: true
  });
};

const createAnime = (body: AddAnimeBody) => {
  return request.post('/api/admin/anime', body, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const updateAnime = (body: EditAnimeBody) => {
  const { id, ...rest } = body;
  return request.put(`/api/admin/anime/${id}`, rest, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const deleteAnime = (params: DeleteAnimeParams) => {
  const { id } = params;
  return request.delete(`/api/admin/anime/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

const fetchAnimeOptions = () => {
  return request.get<AnimeOptionRes>('/api/admin/anime/options', {
    showErrorToast: true
  });
};

export type MediaType = ScrapeSearchItem['mediaType'];
export type ScrapeSearchItem = ApiData<'/api/admin/scrape/search'>[number];
export type ScrapeDetailResult = ApiData<'/api/admin/scrape/detail'>;
type ScrapeSearchParams = ApiQuery<'/api/admin/scrape/search'>;
type ScrapeDetailParams = ApiQuery<'/api/admin/scrape/detail'>;

const scrapeSearch = (params: ScrapeSearchParams) => {
  return request.get<ScrapeSearchItem[]>('/api/admin/scrape/search', {
    params,
    showErrorToast: true
  });
};

const scrapeDetail = (params: ScrapeDetailParams) => {
  return request.get<ScrapeDetailResult>('/api/admin/scrape/detail', {
    params,
    showErrorToast: true
  });
};

export {
  type AnimeListParams,
  fetchAnimes,
  type AnimeListRes,
  type AnimeListItem,
  type AddAnimeBody,
  type EditAnimeBody,
  type AnimeOptionRes,
  createAnime,
  deleteAnime,
  updateAnime,
  fetchAnimeOptions,
  scrapeSearch,
  scrapeDetail
};
