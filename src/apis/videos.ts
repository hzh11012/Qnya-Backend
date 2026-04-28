import request from '@/lib/request';

interface VideoListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
}

interface VideoListItem {
  id: number;
  animeId: number;
  anime: {
    name: string;
    cover: string;
  };
  title: string;
  episode: number;
  url: string;
  views: number;
  createdAt: string;
}

interface VideoListRes {
  items: VideoListItem[];
  total: number;
}

interface AddVideoBody {
  animeId: number;
  title: string;
  episode: number;
  url: string;
}

interface EditVideoParams {
  id: number;
}

type EditVideoBody = EditVideoParams & Partial<AddVideoBody>;

interface DeleteVideoParams {
  id: number;
}

const fetchVideos = (params: VideoListParams) => {
  return request.get<VideoListRes>('/api/admin/videos', {
    params,
    showErrorToast: true
  });
};

const createVideo = (body: AddVideoBody) => {
  return request.post('/api/admin/videos', body, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const updateVideo = (body: EditVideoBody) => {
  const { id, ...rest } = body;
  return request.put(`/api/admin/videos/${id}`, rest, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const deleteVideo = (params: DeleteVideoParams) => {
  const { id } = params;
  return request.delete(`/api/admin/videos/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

export {
  fetchVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  type VideoListRes,
  type VideoListItem,
  type AddVideoBody,
  type EditVideoBody
};
