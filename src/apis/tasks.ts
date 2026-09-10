import request from '@/lib/request';
import type { ApiBody, ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type TasksListParams = ApiQuery<'/api/admin/tasks/'>;
type TasksListRes = ApiData<'/api/admin/tasks/'>;
type TasksListItem = TasksListRes['items'][number];
type DeleteTaskParams = ApiPath<'/api/admin/tasks/{id}', 'delete'>;
type FileTreeRes = ApiData<'/api/admin/files/tree'>;
type FileNode = FileTreeRes[number];
type FileTreeParams = ApiQuery<'/api/admin/files/tree'>;
type FileIngestParams = ApiBody<'/api/admin/tasks/ingest'>;

const fetchTasks = (params: TasksListParams) => {
  return request.get<TasksListRes>('/api/admin/tasks', {
    params,
    showErrorToast: true
  });
};

const deleteTask = (params: DeleteTaskParams) => {
  const { id } = params;
  return request.delete(`/api/admin/tasks/${id}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

const fetchFileTree = (params: FileTreeParams) => {
  return request.get<FileTreeRes>(`/api/admin/files/tree`, {
    params: params.path ? { path: params.path } : undefined,
    showErrorToast: true
  });
};

const ingestFile = (params: FileIngestParams) => {
  return request.post('/api/admin/tasks/ingest', params, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

export {
  type TasksListParams,
  fetchTasks,
  deleteTask,
  fetchFileTree,
  ingestFile,
  type TasksListRes,
  type TasksListItem,
  type FileNode,
  type FileTreeRes
};
