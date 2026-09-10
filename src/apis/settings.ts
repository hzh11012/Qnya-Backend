import request from '@/lib/request';
import type { ApiData } from '@/types/helpers';

type SettingsInfoRes = ApiData<'/api/admin/settings/info'>;

export type SettingsInfoResponse = SettingsInfoRes;
export type SettingsInfoServer = SettingsInfoRes['server'];
export type SettingsInfoQbit = SettingsInfoRes['qbit'];
export type SettingsInfoSmtp = SettingsInfoRes['smtp'];
export type SettingsInfoDatabase = SettingsInfoRes['database'];
export type SettingsInfoSession = SettingsInfoRes['session'];
export type SettingsInfoSecurity = SettingsInfoRes['security'];
export type SettingsInfoResource = SettingsInfoRes['resource'];
export type SettingsInfoTmdb = SettingsInfoRes['tmdb'];

export const fetchSettingsInfo = () => {
  return request.get<SettingsInfoResponse>('/api/admin/settings/info', {
    showErrorToast: true
  });
};

export const clearDashboardCache = () => {
  return request.delete<void>('/api/admin/settings/cache', {
    showSuccessToast: true,
    showErrorToast: true
  });
};
