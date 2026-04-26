import request from '@/lib/request';

interface ResourcesListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

interface ResourcesListItem {
  title: string;
  magnet: string;
  size: number;
  fansub?: string;
  createdAt: string;
}

interface ResourcesListRes {
  items: ResourcesListItem[];
  hasMore: boolean;
}

const fetchResources = (params: ResourcesListParams) => {
  return request.get<ResourcesListRes>('/api/admin/resources', {
    params,
    showErrorToast: true
  });
};

export { fetchResources, type ResourcesListRes, type ResourcesListItem };
