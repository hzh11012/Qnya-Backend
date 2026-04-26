import request from '@/lib/request';

interface FavoriteListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
}

interface FavoriteListItem {
  id: number;
  userId: number;
  animeId: number;
  user: {
    name: string;
  };
  anime: {
    name: string;
    cover: string;
  };
  createdAt: string;
}

interface FavoriteListRes {
  items: FavoriteListItem[];
  total: number;
}

interface DeleteFavoriteParams {
  id: number;
}

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
  fetchFavorites,
  deleteFavorite,
  type FavoriteListRes,
  type FavoriteListItem
};
