import request from '@/lib/request';

/**
 * 手动全量重建番剧搜索索引（Meilisearch）
 *
 * 日常索引由后端写同步与启动校验维护，此接口仅用于索引异常时兜底修复
 */
export const reindexSearchIndex = () => {
  return request.post<void>('/api/admin/search/reindex', {
    showSuccessToast: true,
    showErrorToast: true
  });
};
