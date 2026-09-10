import request from '@/lib/request';
import type { ApiBody, ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type SeriesListParams = ApiQuery<'/api/admin/series/'>;
type SeriesListRes = ApiData<'/api/admin/series/'>;
type SeriesListItem = SeriesListRes['items'][number];
type AddSeriesBody = ApiBody<'/api/admin/series/'>;
type DeleteSeriesParams = ApiPath<'/api/admin/series/{id}', 'delete'>;
type SeriesOptionRes = ApiData<'/api/admin/series/options'>;
type SeriesOptionItem = SeriesOptionRes[number];

const fetchSeries = (params: SeriesListParams) => {
  return request.get<SeriesListRes>('/api/admin/series', {
    params,
    showErrorToast: true
  });
};

const createSeries = (body: AddSeriesBody) => {
  return request.post('/api/admin/series', body, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const deleteSeries = (params: DeleteSeriesParams) => {
  const { id } = params;
  return request.delete(`/api/admin/series/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

const fetchSeriesOptions = () => {
  return request.get<SeriesOptionRes>('/api/admin/series/options', {
    showErrorToast: true
  });
};

export {
  type SeriesListParams,
  fetchSeries,
  type SeriesListRes,
  type SeriesListItem,
  type SeriesOptionRes,
  type SeriesOptionItem,
  createSeries,
  deleteSeries,
  fetchSeriesOptions
};
