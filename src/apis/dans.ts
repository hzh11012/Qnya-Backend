import request from '@/lib/request';
import type { ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type DanmakuListParams = ApiQuery<'/api/admin/danmaku/'>;
type DanmakuListRes = ApiData<'/api/admin/danmaku/'>;
type DanmakuListItem = DanmakuListRes['items'][number];
type DeleteDanmakuParams = ApiPath<'/api/admin/danmaku/{id}', 'delete'>;

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
  type DanmakuListItem,
  type DanmakuListParams
};
