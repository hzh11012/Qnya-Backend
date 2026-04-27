import request from '@/lib/request';

interface FeedbackListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
  type?: string[];
  status?: string[];
}

interface FeedbackListItem {
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
  type: 'consultation' | 'suggestion' | 'complaint' | 'other';
  content: string;
  status: 'pending' | 'processing' | 'done';
  createdAt: string;
}

interface FeedbackListRes {
  items: FeedbackListItem[];
  total: number;
}

interface DeleteFeedbackParams {
  id: number;
}

interface UpdateFeedbackBody {
  id: number;
  status?: 'pending' | 'processing' | 'done';
}

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
  fetchFeedbacks,
  deleteFeedback,
  updateFeedback,
  type FeedbackListRes,
  type FeedbackListItem,
  type UpdateFeedbackBody
};
