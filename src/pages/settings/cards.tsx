import type { SettingsInfoResponse } from '@/apis/settings';
import { CardTitle, OverviewCard } from '@/components/custom/overview/card';
import { InfoRow } from '@/components/custom/overview/info-row';
import { formatMs, formatUptime } from '@/lib/utils';
import {
  AtSign,
  Clock,
  Cpu,
  Database,
  Download,
  FolderOpen,
  Globe,
  HardDrive,
  Image,
  KeyRound,
  Link,
  Lock,
  Mail,
  PlugZap,
  Server,
  ShieldAlert,
  ShieldCheck,
  Timer,
  Users,
  Zap
} from 'lucide-react';

const TruncatedValue = ({ value }: { value: string }) => (
  <span
    className='block max-w-55 truncate text-right'
    title={value}
  >
    {value}
  </span>
);

const InfoList = ({ children }: { children: React.ReactNode }) => (
  <div className='flex flex-col'>{children}</div>
);

export const ServerCard = ({
  data
}: {
  data: SettingsInfoResponse['server'];
}) => (
  <OverviewCard className='h-full'>
    <CardTitle icon={Server}>服务器</CardTitle>
    <InfoList>
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
    </InfoList>
  </OverviewCard>
);

export const QbitCard = ({ data }: { data: SettingsInfoResponse['qbit'] }) => (
  <OverviewCard className='h-full'>
    <CardTitle icon={Download}>qBittorrent</CardTitle>
    <InfoList>
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
    </InfoList>
  </OverviewCard>
);

export const SmtpCard = ({ data }: { data: SettingsInfoResponse['smtp'] }) => (
  <OverviewCard className='h-full'>
    <CardTitle icon={Mail}>SMTP 邮件</CardTitle>
    <InfoList>
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
    </InfoList>
  </OverviewCard>
);

export const DatabaseCard = ({
  data
}: {
  data: SettingsInfoResponse['database'];
}) => (
  <OverviewCard className='h-full'>
    <CardTitle icon={Database}>数据库连接池</CardTitle>
    <InfoList>
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
    </InfoList>
  </OverviewCard>
);

export const SessionCard = ({
  data
}: {
  data: SettingsInfoResponse['session'];
}) => (
  <OverviewCard className='h-full'>
    <CardTitle icon={KeyRound}>Session 会话</CardTitle>
    <InfoList>
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
    </InfoList>
  </OverviewCard>
);

export const SecurityCard = ({
  data
}: {
  data: SettingsInfoResponse['security'];
}) => (
  <OverviewCard className='h-full'>
    <CardTitle icon={ShieldCheck}>安全配置</CardTitle>
    <InfoList>
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
    </InfoList>
  </OverviewCard>
);

export const ResourceCard = ({
  data
}: {
  data: SettingsInfoResponse['resource'];
}) => (
  <OverviewCard className='h-full'>
    <CardTitle icon={HardDrive}>资源路径</CardTitle>
    <InfoList>
      <InfoRow
        icon={FolderOpen}
        label='根路径'
        value={<TruncatedValue value={data.rootPath} />}
      />
    </InfoList>
  </OverviewCard>
);

export const TmdbCard = ({ data }: { data: SettingsInfoResponse['tmdb'] }) => (
  <OverviewCard className='h-full'>
    <CardTitle icon={Image}>TMDB 配置</CardTitle>
    <InfoList>
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
    </InfoList>
  </OverviewCard>
);
