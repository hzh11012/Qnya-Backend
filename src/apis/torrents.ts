import request from '@/lib/request';

interface TorrentsListParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: string;
}

interface TorrentsListItem {
  name: string;
  status: string;
  progress: number;
  size: number;
  createdAt: string;
}

interface TorrentsListRes {
  items: TorrentsListItem[];
  total: number;
}

interface AddTorrentsBody {
  torrentUrl: string;
}

const fetchTorrents = (params: TorrentsListParams) => {
  return request.get<TorrentsListRes>('/api/admin/torrents', {
    params,
    showErrorToast: true
  });
};

const createTorrent = (body: AddTorrentsBody) => {
  return request.post('/api/admin/torrents', body, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

export {
  fetchTorrents,
  type TorrentsListRes,
  type TorrentsListItem,
  createTorrent
};
