import request from '@/lib/request';
import type { ApiData, ApiQuery } from '@/types/helpers';

type TagsListParams = ApiQuery<'/api/admin/tags/'>;
type TagsListRes = ApiData<'/api/admin/tags/'>;
type TagsListItem = TagsListRes['items'][number];
type TagsOptionRes = ApiData<'/api/admin/tags/options'>;
type TagsOptionItem = TagsOptionRes[number];

const fetchTags = (params: TagsListParams) => {
  return request.get<TagsListRes>('/api/admin/tags', {
    params,
    showErrorToast: true
  });
};

const fetchTagsOptions = () => {
  return request.get<TagsOptionRes>('/api/admin/tags/options', {
    showErrorToast: true
  });
};

export {
  type TagsListParams,
  fetchTags,
  fetchTagsOptions,
  type TagsListRes,
  type TagsListItem,
  type TagsOptionRes,
  type TagsOptionItem
};
