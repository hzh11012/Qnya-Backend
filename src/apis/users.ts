import request from '@/lib/request';
import type { ApiBody, ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type UserListParams = ApiQuery<'/api/admin/users/'>;
type UserListRes = ApiData<'/api/admin/users/'>;
type UserListItem = UserListRes['items'][number];
type EditUserBody = ApiPath<'/api/admin/users/{id}', 'put'> &
  ApiBody<'/api/admin/users/{id}', 'put'>;

const fetchUsers = (params: UserListParams) => {
  return request.get<UserListRes>('/api/admin/users', {
    params,
    showErrorToast: true
  });
};

const updateUser = (body: EditUserBody) => {
  const { id, ...rest } = body;
  return request.put(`/api/admin/users/${id}`, rest, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

export {
  type UserListParams,
  fetchUsers,
  type UserListRes,
  type UserListItem,
  type EditUserBody,
  updateUser
};
