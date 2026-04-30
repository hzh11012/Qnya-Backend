import request from '@/lib/request';

export interface SettingsInfoServer {
  nodeVersion: string;
  environment: string;
  uptime: number;
}

export interface SettingsInfoFfmpeg {
  encoder: string;
  threads: number;
  hlsSegmentTime: number;
  transcodePath: string;
  activeCount: number;
  queueLength: number;
}

export interface SettingsInfoQbit {
  host: string;
  downloadPath: string;
}

export interface SettingsInfoSmtp {
  host: string;
  port: number;
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

export interface SettingsInfoResponse {
  server: SettingsInfoServer;
  ffmpeg: SettingsInfoFfmpeg;
  qbit: SettingsInfoQbit;
  smtp: SettingsInfoSmtp;
  database: SettingsInfoDatabase;
  session: SettingsInfoSession;
  security: SettingsInfoSecurity;
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
