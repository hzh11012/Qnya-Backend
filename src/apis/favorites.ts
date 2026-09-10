import request from '@/lib/request';
import type { ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type FavoriteListParams = ApiQuery<'/api/admin/collections/'>;
type FavoriteListRes = ApiData<'/api/admin/collections/'>;
type FavoriteListItem = FavoriteListRes['items'][number];
type DeleteFavoriteParams = ApiPath<'/api/admin/collections/{id}', 'delete'>;

const fetchFavorites = (params: FavoriteListParams) => {
  return request.get<FavoriteListRes>('/api/admin/collections', {
    params,
    showErrorToast: true
  });
};

const deleteFavorite = (params: DeleteFavoriteParams) => {
  const { id } = params;
  return request.delete(`/api/admin/collections/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

export {
  type FavoriteListParams,
  fetchFavorites,
  deleteFavorite,
  type FavoriteListRes,
  type FavoriteListItem
};
