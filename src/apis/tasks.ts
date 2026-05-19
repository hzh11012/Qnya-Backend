import request from '@/lib/request';

interface TasksListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: string;
  order?: string;
  status?: string[];
}

interface TasksListItem {
  id: number;
  filename: string;
  fileSize: number;
  status: string;
  createdAt: string;
}

interface TasksListRes {
  items: TasksListItem[];
  total: number;
}

interface DeleteTaskParams {
  id: number;
}

interface FileNode {
  name: string;
  path: string;
  hasChildren: boolean;
}

type FileTreeRes = FileNode[];

interface FileTreeParams {
  path?: string;
}

interface FileIngestParams {
  id: number;
  path: string;
}

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
  fetchTasks,
  deleteTask,
  fetchFileTree,
  ingestFile,
  type TasksListRes,
  type TasksListItem,
  type FileNode,
  type FileTreeRes
};
