import request from '@/lib/request';

interface TasksListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
}

interface TasksListItem {
  id: number;
  filename: string;
  fileSize: number;
  needsTranscode: boolean;
  status: string;
  errorMessage: string | null;
  transcodeProgress: number;
  createdAt: string;
}

interface TasksListRes {
  items: TasksListItem[];
  total: number;
}

interface TranscodeParams {
  id: number;
}

interface DeleteTaskParams {
  id: number;
}

const fetchTasks = (params: TasksListParams) => {
  return request.get<TasksListRes>('/api/admin/tasks', {
    params,
    showErrorToast: true
  });
};

const createTranscode = (params: TranscodeParams) => {
  return request.post('/api/admin/transcodes', params, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

const deleteTranscode = (params: TranscodeParams) => {
  const { id } = params;
  return request.delete(`/api/admin/transcodes/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

const deleteTask = (params: DeleteTaskParams) => {
  const { id } = params;
  return request.delete(`/api/admin/tasks/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

const retryTask = (params: TranscodeParams) => {
  const { id } = params;
  return request.post(`/api/admin/transcodes/${id}/retry`, null, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

export {
  fetchTasks,
  createTranscode,
  deleteTranscode,
  deleteTask,
  retryTask,
  type TasksListRes,
  type TasksListItem
};
