import request from '@/lib/request';
import type { ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type HistoryListParams = ApiQuery<'/api/admin/histories/'>;
type HistoryListRes = ApiData<'/api/admin/histories/'>;
type HistoryListItem = HistoryListRes['items'][number];
type DeleteHistoryParams = ApiPath<'/api/admin/histories/{id}', 'delete'>;

const fetchHistories = (params: HistoryListParams) => {
  return request.get<HistoryListRes>('/api/admin/histories', {
    params,
    showErrorToast: true
  });
};

const deleteHistory = (params: DeleteHistoryParams) => {
  const { id } = params;
  return request.delete(`/api/admin/histories/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

export {
  type HistoryListParams,
  fetchHistories,
  deleteHistory,
  type HistoryListRes,
  type HistoryListItem
};
