import request from '@/lib/request';

interface HistoryListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
}

interface HistoryListItem {
  id: number;
  user: {
    name: string;
  };
  anime: {
    name: string;
    cover: string;
  };
  time: number;
  createdAt: string;
}

interface HistoryListRes {
  items: HistoryListItem[];
  total: number;
}

interface DeleteHistoryParams {
  id: number;
}

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
  fetchHistories,
  deleteHistory,
  type HistoryListRes,
  type HistoryListItem
};
