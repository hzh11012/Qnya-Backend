import request from '@/lib/request';
import type { ApiBody, ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type FeedbackListParams = ApiQuery<'/api/admin/feedbacks/'>;
type FeedbackListRes = ApiData<'/api/admin/feedbacks/'>;
type FeedbackListItem = FeedbackListRes['items'][number];
type DeleteFeedbackParams = ApiPath<'/api/admin/feedbacks/{id}', 'delete'>;
type UpdateFeedbackBody = ApiPath<'/api/admin/feedbacks/{id}', 'put'> &
  ApiBody<'/api/admin/feedbacks/{id}', 'put'>;

const fetchFeedbacks = (params: FeedbackListParams) => {
  return request.get<FeedbackListRes>('/api/admin/feedbacks', {
    params,
    showErrorToast: true
  });
};

const deleteFeedback = (params: DeleteFeedbackParams) => {
  const { id } = params;
  return request.delete(`/api/admin/feedbacks/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

const updateFeedback = (body: UpdateFeedbackBody) => {
  const { id, ...rest } = body;
  return request.put(`/api/admin/feedbacks/${id}`, rest, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

export {
  type FeedbackListParams,
  fetchFeedbacks,
  deleteFeedback,
  updateFeedback,
  type FeedbackListRes,
  type FeedbackListItem,
  type UpdateFeedbackBody
};
