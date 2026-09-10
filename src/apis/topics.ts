import request from '@/lib/request';
import type { ApiBody, ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type TopicListParams = ApiQuery<'/api/admin/topics/'>;
type TopicListRes = ApiData<'/api/admin/topics/'>;
type TopicListItem = TopicListRes['items'][number];
type AddTopicBody = ApiBody<'/api/admin/topics/'>;
type UpdateTopicBody = ApiPath<'/api/admin/topics/{id}', 'put'> &
  ApiBody<'/api/admin/topics/{id}', 'put'>;
type DeleteTopicParams = ApiPath<'/api/admin/topics/{id}', 'delete'>;

const fetchTopics = (params: TopicListParams) => {
  return request.get<TopicListRes>('/api/admin/topics', {
    params,
    showErrorToast: true
  });
};

const createTopic = (body: AddTopicBody) => {
  return request.post('/api/admin/topics', body, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const updateTopic = (body: UpdateTopicBody) => {
  const { id, ...rest } = body;
  return request.put(`/api/admin/topics/${id}`, rest, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const deleteTopic = (params: DeleteTopicParams) => {
  const { id } = params;
  return request.delete(`/api/admin/topics/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

export {
  type TopicListParams,
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  type TopicListRes,
  type TopicListItem,
  type UpdateTopicBody
};
