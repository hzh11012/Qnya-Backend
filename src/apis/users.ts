import request from '@/lib/request';

interface UserListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
  role?: string[];
  status?: boolean[];
}

interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'premium' | 'user' | 'guest';
  status: boolean;
  avatar: string | null;
  createdAt: string;
}

interface UserListRes {
  items: UserListItem[];
  total: number;
}

interface EditUserParams {
  id: number;
}

type EditUserBody = EditUserParams & {
  name?: string;
  role?: 'admin' | 'premium' | 'user' | 'guest';
  status?: boolean;
  avatar?: string | null;
};

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
  fetchUsers,
  type UserListRes,
  type UserListItem,
  type EditUserBody,
  updateUser
};
