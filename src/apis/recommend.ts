import request from '@/lib/request';
import type { ApiData } from '@/types/helpers';

export type RecommendStatusResponse = ApiData<'/api/admin/recommend/status'>;

/** 推荐系统状态：共现矩阵最近重建时间、亲和记录数、可推荐番剧数 */
export const fetchRecommendStatus = () => {
  return request.get<RecommendStatusResponse>('/api/admin/recommend/status');
};

/**
 * 手动全量重建猜你喜欢共现矩阵
 *
 * 日常由后端定时任务（6 小时）维护，此接口仅用于异常时兜底修复
 */
export const refreshAffinity = () => {
  return request.post<void>('/api/admin/recommend/refresh', {
    showSuccessToast: true,
    showErrorToast: true
  });
};
