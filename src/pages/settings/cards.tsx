import type { SettingsInfoResponse } from '@/apis';
import {
  Server,
  Video,
  Download,
  Mail,
  Database,
  KeyRound,
  ShieldCheck,
  Clock,
  Cpu,
  Globe,
  FolderOpen,
  Activity,
  ListOrdered,
  AtSign,
  PlugZap,
  Users,
  Timer,
  Zap,
  Lock,
  HardDrive,
  Image,
  Link,
  ShieldAlert
} from 'lucide-react';
import { formatUptime, formatMs } from '@/lib/utils';
import { Card, SectionTitle, InfoRow, ActiveBadge } from './components';

const TruncatedValue = ({ value }: { value: string }) => (
  <span
    className='max-w-55 truncate block text-right'
    title={value}
  >
    {value}
  </span>
);

export const ServerCard = ({
  data
}: {
  data: SettingsInfoResponse['server'];
}) => (
  <Card>
    <SectionTitle
      icon={Server}
      title='服务器'
    />
    <InfoRow
      icon={Cpu}
      label='Node 版本'
      value={data.nodeVersion}
    />
    <InfoRow
      icon={Globe}
      label='运行环境'
      value={data.environment}
      highlight={data.environment === 'production' ? 'success' : 'warning'}
    />
    <InfoRow
      icon={Clock}
      label='已运行时长'
      value={formatUptime(data.uptime)}
    />
    <InfoRow
      icon={PlugZap}
      label='监听端口'
      value={`${data.port}`}
    />
    <InfoRow
      icon={AtSign}
      label='管理员邮箱'
      value={data.adminEmail || '未设置'}
    />
  </Card>
);

export const FfmpegCard = ({
  data
}: {
  data: SettingsInfoResponse['ffmpeg'];
}) => (
  <Card>
    <SectionTitle
      icon={Video}
      title='FFmpeg 转码'
      badge={<ActiveBadge count={data.activeCount} />}
    />
    <InfoRow
      icon={FolderOpen}
      label='可执行文件路径'
      value={<TruncatedValue value={data.path} />}
    />
    <InfoRow
      icon={Cpu}
      label='编码器'
      value={data.encoder}
    />
    <InfoRow
      icon={Activity}
      label='线程数'
      value={`${data.threads} 线程`}
    />
    <InfoRow
      icon={Timer}
      label='HLS 分片时长'
      value={`${data.hlsSegmentTime}s`}
    />
    <InfoRow
      icon={FolderOpen}
      label='输出路径'
      value={<TruncatedValue value={data.transcodePath} />}
    />
    <InfoRow
      icon={Activity}
      label='活跃转码数'
      value={`${data.activeCount}`}
      highlight={data.activeCount > 0 ? 'success' : undefined}
    />
    <InfoRow
      icon={ListOrdered}
      label='队列等待数'
      value={`${data.queueLength}`}
      highlight={data.queueLength > 5 ? 'warning' : undefined}
    />
  </Card>
);

export const QbitCard = ({ data }: { data: SettingsInfoResponse['qbit'] }) => (
  <Card>
    <SectionTitle
      icon={Download}
      title='qBittorrent'
    />
    <InfoRow
      icon={PlugZap}
      label='连接地址'
      value={data.host}
    />
    <InfoRow
      icon={FolderOpen}
      label='下载路径'
      value={<TruncatedValue value={data.downloadPath} />}
    />
    <InfoRow
      icon={HardDrive}
      label='宿主机下载路径'
      value={<TruncatedValue value={data.hostDownloadPath} />}
    />
  </Card>
);

export const SmtpCard = ({ data }: { data: SettingsInfoResponse['smtp'] }) => (
  <Card>
    <SectionTitle
      icon={Mail}
      title='SMTP 邮件'
    />
    <InfoRow
      icon={Server}
      label='服务器'
      value={data.host}
    />
    <InfoRow
      icon={PlugZap}
      label='端口'
      value={`${data.port}`}
    />
    <InfoRow
      icon={ShieldAlert}
      label='SSL 加密'
      value={data.secure ? '启用' : '禁用'}
      highlight={data.secure ? 'success' : 'warning'}
    />
    <InfoRow
      icon={AtSign}
      label='发件人'
      value={data.from}
    />
  </Card>
);

export const DatabaseCard = ({
  data
}: {
  data: SettingsInfoResponse['database'];
}) => (
  <Card>
    <SectionTitle
      icon={Database}
      title='数据库连接池'
    />
    <InfoRow
      icon={Users}
      label='连接池上限'
      value={`${data.poolMax} 个`}
    />
    <InfoRow
      icon={Timer}
      label='空闲超时'
      value={formatMs(data.poolIdleTimeout)}
    />
    <InfoRow
      icon={Timer}
      label='连接超时'
      value={formatMs(data.poolConnectionTimeout)}
    />
  </Card>
);

export const SessionCard = ({
  data
}: {
  data: SettingsInfoResponse['session'];
}) => (
  <Card>
    <SectionTitle
      icon={KeyRound}
      title='Session 会话'
    />
    <InfoRow
      icon={Clock}
      label='有效期'
      value={formatMs(data.maxAge)}
    />
    <InfoRow
      icon={Timer}
      label='续期阈值'
      value={formatMs(data.renewThreshold)}
    />
    <InfoRow
      icon={Globe}
      label='域名'
      value={data.domain || '未设置'}
    />
  </Card>
);

export const SecurityCard = ({
  data
}: {
  data: SettingsInfoResponse['security'];
}) => (
  <Card>
    <SectionTitle
      icon={ShieldCheck}
      title='安全配置'
    />
    <InfoRow
      icon={Zap}
      label='限流阈值'
      value={`${data.rateLimitMax} 次/分`}
    />
    <InfoRow
      icon={Lock}
      label='CORS 来源'
      value={<TruncatedValue value={data.corsOrigins} />}
    />
  </Card>
);

export const ResourceCard = ({
  data
}: {
  data: SettingsInfoResponse['resource'];
}) => (
  <Card>
    <SectionTitle
      icon={HardDrive}
      title='资源路径'
    />
    <InfoRow
      icon={FolderOpen}
      label='根路径'
      value={<TruncatedValue value={data.rootPath} />}
    />
  </Card>
);

export const TmdbCard = ({ data }: { data: SettingsInfoResponse['tmdb'] }) => (
  <Card>
    <SectionTitle
      icon={Image}
      title='TMDB 配置'
    />
    <InfoRow
      icon={Link}
      label='图片域名'
      value={<TruncatedValue value={data.imageDomain} />}
    />
    <InfoRow
      icon={Globe}
      label='API 域名'
      value={<TruncatedValue value={data.apiDomain} />}
    />
  </Card>
);
