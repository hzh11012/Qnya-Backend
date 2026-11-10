import request from '@/lib/request';
import type { ApiBody, ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type AppReleaseListParams = ApiQuery<'/api/admin/app-releases/'>;
type AppReleaseListRes = ApiData<'/api/admin/app-releases/'>;
type AppReleaseListItem = AppReleaseListRes['items'][number];
type CreateAppReleaseBody = ApiBody<'/api/admin/app-releases/', 'post'>;
type DeleteAppReleaseParams = ApiPath<'/api/admin/app-releases/{id}', 'delete'>;
type EditAppReleaseBody = ApiPath<'/api/admin/app-releases/{id}', 'put'> &
  ApiBody<'/api/admin/app-releases/{id}', 'put'>;

const fetchAppReleases = (params: AppReleaseListParams) => {
  return request.get<AppReleaseListRes>('/api/admin/app-releases', {
    params,
    showErrorToast: true
  });
};

const createAppRelease = (body: CreateAppReleaseBody) => {
  return request.post('/api/admin/app-releases', body, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const deleteAppRelease = (params: DeleteAppReleaseParams) => {
  const { id } = params;
  return request.delete(`/api/admin/app-releases/${id}`, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const updateAppRelease = (body: EditAppReleaseBody) => {
  const { id, ...rest } = body;
  return request.put(`/api/admin/app-releases/${id}`, rest, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

export {
  type AppReleaseListParams,
  fetchAppReleases,
  createAppRelease,
  deleteAppRelease,
  updateAppRelease,
  type AppReleaseListRes,
  type AppReleaseListItem,
  type CreateAppReleaseBody
};
