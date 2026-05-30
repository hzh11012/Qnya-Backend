import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Wrench, BookOpen, Cable } from 'lucide-react';
import type { McpTool } from '@/apis';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Card = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'rounded-md border bg-card p-5 flex flex-col gap-3',
      className
    )}
  >
    {children}
  </div>
);

export const SectionTitle = ({
  icon: Icon,
  title,
  badge
}: {
  icon: React.ElementType;
  title: string;
  badge?: React.ReactNode;
}) => (
  <div className='flex items-center gap-2 pb-1'>
    <Icon className='size-4 text-primary shrink-0' />
    <span className='font-semibold text-sm'>{title}</span>
    {badge}
  </div>
);

export const InfoRow = ({
  label,
  value,
  icon: Icon,
  highlight
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  highlight?: 'success' | 'warning' | 'danger';
}) => {
  const highlightCls = {
    success: 'text-emerald-600 dark:text-emerald-400 font-medium',
    warning: 'text-yellow-600 dark:text-yellow-400 font-medium',
    danger: 'text-destructive font-medium'
  };

  return (
    <div className='flex items-center justify-between py-2 border-b last:border-0 border-border/50'>
      <div className='flex items-center gap-2 text-sm'>
        {Icon && <Icon className='size-3.5 shrink-0' />}
        <span>{label}</span>
      </div>
      <span
        className={cn(
          'text-sm font-mono',
          highlight ? highlightCls[highlight] : 'text-foreground'
        )}
      >
        {value}
      </span>
    </div>
  );
};

export const SkeletonCard = ({ rows = 3 }: { rows?: number }) => (
  <Card>
    <div className='flex items-center gap-2 pb-1'>
      <Skeleton className='size-4 rounded' />
      <Skeleton className='h-4 w-28' />
    </div>
    <div className='flex flex-col gap-3'>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className='flex items-center justify-between py-2 border-b last:border-0 border-border/50'
        >
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-32' />
        </div>
      ))}
    </div>
  </Card>
);

export const ToolCard = ({ tool }: { tool: McpTool }) => (
  <div className='rounded-md border bg-card p-4 flex flex-col gap-2'>
    <div className='flex items-center gap-2'>
      <Wrench className='size-3.5 text-primary shrink-0' />
      <span className='text-sm font-mono font-medium truncate'>
        {tool.name}
      </span>
    </div>
    <p className='text-xs text-muted-foreground leading-relaxed line-clamp-3'>
      {tool.description}
    </p>
  </div>
);

export const McpGuide = ({ guide }: { guide: string }) => (
  <Card className='gap-0'>
    <SectionTitle
      icon={BookOpen}
      title='操作指南'
    />
    <div className='pt-2'>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className='text-xl font-bold mb-4 mt-2 text-foreground'>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className='text-base font-semibold mb-3 mt-5 text-foreground border-b border-border/50 pb-1'>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className='text-sm font-semibold mb-2 mt-4 text-foreground'>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className='text-sm text-foreground mb-3 leading-relaxed'>
              {children}
            </p>
          ),
          code: ({ children, className }) => (
            <code
              className={cn(
                'font-mono text-sm',
                !className && 'bg-primary/10 text-primary px-1.5 py-0.5 rounded'
              )}
            >
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className='bg-border/40 rounded-md p-4 overflow-x-auto text-sm font-mono mb-4 [&_code]:bg-transparent [&_code]:text-inherit [&_code]:p-0'>
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className='list-disc list-inside text-sm mb-3 space-y-1'>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className='list-decimal list-inside text-sm mb-3 space-y-1'>
              {children}
            </ol>
          ),
          li: ({ children }) => <li className='text-foreground'>{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary underline hover:opacity-80'
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className='font-semibold'>{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className='border-l-4 border-primary/30 pl-4 italic text-secondary mb-3'>
              {children}
            </blockquote>
          ),
          hr: () => <hr className='border-border/50 my-4' />,
          table: ({ children }) => (
            <div className='overflow-x-auto mb-4'>
              <table className='w-full text-sm border-collapse'>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className='border border-border px-3 py-2 bg-border/30 text-left font-medium text-sm'>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className='border border-border px-3 py-2 text-sm'>
              {children}
            </td>
          )
        }}
      >
        {guide}
      </Markdown>
    </div>
  </Card>
);

const InlineCode = ({ children }: { children: string }) => (
  <code className='bg-primary/10 text-primary px-1 py-0.5 rounded text-xs font-mono'>
    {children}
  </code>
);

const CodeBlock = ({ children }: { children: string }) => (
  <pre className='bg-border/40 rounded-md p-3 overflow-x-auto text-sm font-mono my-2'>
    <code className='text-foreground'>{children}</code>
  </pre>
);

export const McpIntegration = ({
  endpoint,
  tokenEnabled
}: {
  endpoint: string;
  tokenEnabled: boolean;
}) => {
  const fullEndpoint = endpoint.startsWith('http')
    ? endpoint
    : `${window.location.origin}${endpoint}`;

  const jsonSnippet = JSON.stringify(
    {
      mcpServers: {
        qnya: tokenEnabled
          ? {
              url: fullEndpoint,
              headers: { Authorization: 'Bearer YOUR_TOKEN' }
            }
          : { url: fullEndpoint }
      }
    },
    null,
    2
  );

  const cliSnippet = tokenEnabled
    ? `claude mcp add --transport http qnya ${fullEndpoint} \\\n  --header "Authorization: Bearer YOUR_TOKEN"`
    : `claude mcp add --transport http qnya ${fullEndpoint}`;

  return (
    <Card>
      <SectionTitle
        icon={Cable}
        title='接入 Agent'
      />
      <div className='flex flex-col text-sm'>
        <p className='text-xs text-secondary mb-1'>
          将以下配置写入 <InlineCode>claude_desktop_config.json</InlineCode>
          （Claude Desktop） 或 <InlineCode>~/.cursor/mcp.json</InlineCode>
          （Cursor）：
        </p>
        <CodeBlock>{jsonSnippet}</CodeBlock>
        <p className='text-xs text-secondary mb-1'>Claude Code：</p>
        <CodeBlock>{cliSnippet}</CodeBlock>
        {tokenEnabled && (
          <p className='text-xs text-secondary'>
            将 <InlineCode>YOUR_TOKEN</InlineCode> 替换为后端管理员签发的 Bearer
            Token。
          </p>
        )}
      </div>
    </Card>
  );
};
