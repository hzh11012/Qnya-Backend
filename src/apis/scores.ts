import request from '@/lib/request';

interface ScoreListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
  status?: boolean[];
}

interface ScoreListItem {
  id: number;
  userId: number;
  animeId: number;
  score: number;
  content: string;
  status: boolean;
  user: {
    name: string;
  };
  anime: {
    name: string;
    cover: string;
  };
  createdAt: string;
}

interface ScoreListRes {
  items: ScoreListItem[];
  total: number;
}

interface DeleteScoreParams {
  id: number;
}

interface UpdateScoreBody {
  id: number;
  status: boolean;
}

const fetchScores = (params: ScoreListParams) => {
  return request.get<ScoreListRes>('/api/admin/scores', {
    params,
    showErrorToast: true
  });
};

const deleteScore = (params: DeleteScoreParams) => {
  const { id } = params;
  return request.delete(`/api/admin/scores/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

const updateScore = (body: UpdateScoreBody) => {
  const { id, ...rest } = body;
  return request.put(`/api/admin/scores/${id}`, rest, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

export {
  fetchScores,
  deleteScore,
  updateScore,
  type ScoreListRes,
  type ScoreListItem,
  type UpdateScoreBody
};
