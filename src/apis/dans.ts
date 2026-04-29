import request from '@/lib/request';

interface DanmakuListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
}

interface DanmakuListItem {
  id: number;
  user: {
    name: string;
  };
  anime: {
    name: string;
    cover: string;
  };
  text: string;
  mode: 'scroll' | 'top' | 'bottom';
  color: string;
  time: number;
  createdAt: string;
}

interface DanmakuListRes {
  items: DanmakuListItem[];
  total: number;
}

interface DeleteDanmakuParams {
  id: number;
}

const fetchDanmakus = (params: DanmakuListParams) => {
  return request.get<DanmakuListRes>('/api/admin/danmaku', {
    params,
    showErrorToast: true
  });
};

const deleteDanmaku = (params: DeleteDanmakuParams) => {
  const { id } = params;
  return request.delete(`/api/admin/danmaku/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

export {
  fetchDanmakus,
  deleteDanmaku,
  type DanmakuListRes,
  type DanmakuListItem
};
