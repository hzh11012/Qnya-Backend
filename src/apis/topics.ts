import request from '@/lib/request';

interface TopicListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
  status?: boolean[];
}

interface TopicAnimeItem {
  id: number;
  name: string;
}

interface TopicListItem {
  id: number;
  name: string;
  description: string;
  status: boolean;
  cover: string;
  anime: TopicAnimeItem[];
  createdAt: string;
}

interface TopicListRes {
  items: TopicListItem[];
  total: number;
}

interface AddTopicBody {
  name: string;
  description: string;
  status: boolean;
  cover: string;
  animeIds?: number[];
}

interface UpdateTopicBody {
  id: number;
  name?: string;
  description?: string;
  status?: boolean;
  cover?: string;
  animeIds?: number[];
}

interface DeleteTopicParams {
  id: number;
}

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
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  type TopicListRes,
  type TopicListItem,
  type UpdateTopicBody
};
