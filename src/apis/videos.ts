import request from '@/lib/request';
import type { ApiBody, ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type VideoListParams = ApiQuery<'/api/admin/videos/'>;
type VideoListRes = ApiData<'/api/admin/videos/'>;
type VideoListItem = VideoListRes['items'][number];
type AddVideoBody = ApiBody<'/api/admin/videos/'>;
type EditVideoBody = ApiPath<'/api/admin/videos/{id}', 'put'> &
  ApiBody<'/api/admin/videos/{id}', 'put'>;
type DeleteVideoParams = ApiPath<'/api/admin/videos/{id}', 'delete'>;

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
  type VideoListParams,
  fetchVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  type VideoListRes,
  type VideoListItem,
  type AddVideoBody,
  type EditVideoBody
};
