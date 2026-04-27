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

interface EditAnimeParams {
  id: number;
}

type EditAnimeBody = EditAnimeParams & AddAnimeBody;

interface DeleteAnimeParams {
  id: number;
}

interface AnimeOptionItem {
  label: string;
  value: string;
}

type AnimeOptionRes = AnimeOptionItem[];

const fetchAnimes = (params: AnimeListParams) => {
  return request.get<AnimeListRes>('/api/admin/anime', {
    params,
    showErrorToast: true
  });
};

const createAnime = (body: AddAnimeBody) => {
  return request.post('/api/admin/anime', body, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const updateAnime = (body: EditAnimeBody) => {
  const { id, ...rest } = body;
  return request.put(`/api/admin/anime/${id}`, rest, {
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

const fetchAnimeOptions = () => {
  return request.get<AnimeOptionRes>('/api/admin/anime/options', {
    showErrorToast: true
  });
};

export {
  fetchAnimes,
  type AnimeListRes,
  type AnimeListItem,
  type AddAnimeBody,
  type EditAnimeBody,
  type AnimeOptionRes,
  createAnime,
  deleteAnime,
  updateAnime,
  fetchAnimeOptions
};
