import request from '@/lib/request';
import type { ApiBody, ApiData, ApiQuery } from '@/types/helpers';

type TorrentsListParams = ApiQuery<'/api/admin/torrents/'>;
type TorrentsListRes = ApiData<'/api/admin/torrents/'>;
type TorrentsListItem = TorrentsListRes['items'][number];
type AddTorrentsBody = ApiBody<'/api/admin/torrents/'>;

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
  type TorrentsListParams,
  fetchTorrents,
  type TorrentsListRes,
  type TorrentsListItem,
  createTorrent
};
