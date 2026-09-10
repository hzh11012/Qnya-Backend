import request from '@/lib/request';
import type { ApiBody, ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type ScoreListParams = ApiQuery<'/api/admin/scores/'>;
type ScoreListRes = ApiData<'/api/admin/scores/'>;
type ScoreListItem = ScoreListRes['items'][number];
type DeleteScoreParams = ApiPath<'/api/admin/scores/{id}', 'delete'>;
type UpdateScoreBody = ApiPath<'/api/admin/scores/{id}', 'put'> &
  ApiBody<'/api/admin/scores/{id}', 'put'>;

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
  type ScoreListParams,
  fetchScores,
  deleteScore,
  updateScore,
  type ScoreListRes,
  type ScoreListItem,
  type UpdateScoreBody
};
