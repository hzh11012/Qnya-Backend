import request from '@/lib/request';

interface SeriesListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
}

interface SeriesListItem {
  id: number;
  name: string;
  createdAt: string;
}

interface SeriesListRes {
  items: SeriesListItem[];
  total: number;
}

interface AddSeriesBody {
  name: string;
}

interface DeleteSeriesParams {
  id: number;
}

interface SeriesOptionItem {
  label: string;
  value: string;
}

type SeriesOptionRes = SeriesOptionItem[];

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
  fetchSeries,
  type SeriesListRes,
  type SeriesListItem,
  type SeriesOptionRes,
  createSeries,
  deleteSeries,
  fetchSeriesOptions
};
