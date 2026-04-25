import request from '@/lib/request';

interface AnimeListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
  status?: string[];
  types?: string[];
  months?: string[];
  years?: string[];
  tags?: string[];
}

interface AnimeListItem {
  id: number;
  seriesId: number;
  cover: string;
  banner: string;
  name: string;
  remark: string;
  description: string;
  tags: {
    id: string;
    name: string;
  }[];
  type: 'movie' | 'japanese' | 'american' | 'chinese' | 'adult';
  status: 'draft' | 'upcoming' | 'airing' | 'completed';
  year: number;
  month: 'january' | 'april' | 'july' | 'october';
  seasonName: string | null;
  season: number;
  avgScore: number;
  scoreCount: number;
  director: string;
  cv: string;
  createdAt: string;
}

interface AnimeListRes {
  items: AnimeListItem[];
  total: number;
}

interface AddAnimeBody {
  seriesId: string;
  name: string;
  cover: string;
  banner: string;
  description: string;
  remark: string;
  status: 'draft' | 'upcoming' | 'airing' | 'completed';
  type: 'movie' | 'japanese' | 'american' | 'chinese' | 'adult';
  year: number;
  month: 'january' | 'april' | 'july' | 'october';
  seasonName: string | null;
  season: number;
  tags: string[];
  director: string;
  cv: string;
}

interface EditAnimeBody extends AddAnimeBody {
  id: number;
}

interface DeleteAnimeParams {
  id: number;
}

const getAnimeList = (params: AnimeListParams) => {
  return request.get<AnimeListRes>('/api/admin/anime', {
    params,
    showErrorToast: true
  });
};

const addAnime = (body: AddAnimeBody) => {
  return request.post('/api/admin/anime', body, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const editAnime = (body: EditAnimeBody) => {
  return request.put('/api/admin/anime', body, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const deleteAnime = (params: DeleteAnimeParams) => {
  const { id } = params;
  return request.delete(`/api/admin/anime/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

export {
  getAnimeList,
  type AnimeListRes,
  type AnimeListItem,
  type AddAnimeBody,
  type EditAnimeBody,
  addAnime,
  deleteAnime,
  editAnime
};
