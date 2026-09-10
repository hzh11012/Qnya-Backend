import request from '@/lib/request';
import type { ApiData, ApiQuery } from '@/types/helpers';

type ResourcesListParams = ApiQuery<'/api/admin/resources/'>;
type ResourcesListRes = ApiData<'/api/admin/resources/'>;
type ResourcesListItem = ResourcesListRes['items'][number];

const fetchResources = (params: ResourcesListParams) => {
  return request.get<ResourcesListRes>('/api/admin/resources', {
    params,
    showErrorToast: true
  });
};

export { fetchResources, type ResourcesListRes, type ResourcesListItem };
