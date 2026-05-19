import request from '@/lib/request';

export interface SettingsInfoServer {
  nodeVersion: string;
  environment: string;
  uptime: number;
  port: number;
  adminEmail: string;
}

export interface SettingsInfoQbit {
  host: string;
  downloadPath: string;
  hostDownloadPath: string;
}

export interface SettingsInfoSmtp {
  host: string;
  port: number;
  secure: boolean;
  from: string;
}

export interface SettingsInfoDatabase {
  poolMax: number;
  poolIdleTimeout: number;
  poolConnectionTimeout: number;
}

export interface SettingsInfoSession {
  maxAge: number;
  renewThreshold: number;
  domain: string;
}

export interface SettingsInfoSecurity {
  rateLimitMax: number;
  corsOrigins: string;
}

export interface SettingsInfoResource {
  rootPath: string;
}

export interface SettingsInfoTmdb {
  imageDomain: string;
  apiDomain: string;
}

export interface SettingsInfoResponse {
  server: SettingsInfoServer;
  qbit: SettingsInfoQbit;
  smtp: SettingsInfoSmtp;
  database: SettingsInfoDatabase;
  session: SettingsInfoSession;
  security: SettingsInfoSecurity;
  resource: SettingsInfoResource;
  tmdb: SettingsInfoTmdb;
}

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
