import { cn } from '@/lib/utils';
import { CardTitle, OverviewCard } from '@/components/custom/overview/card';
import { BookOpen, Cable, Wrench } from 'lucide-react';
import type { McpTool } from '@/apis/mcp';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** 可用工具卡 */
export const ToolCard = ({
  tool,
  delay = 0
}: {
  tool: McpTool;
  delay?: number;
}) => (
  <div
    className='animate-fade-up flex flex-col gap-2 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-md'
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className='flex items-center gap-2'>
      <span className='flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
        <Wrench className='size-3.5 text-primary' />
      </span>
      <span className='truncate font-mono text-sm font-medium'>
        {tool.name}
      </span>
    </div>
    <p className='line-clamp-3 text-xs leading-relaxed text-muted'>
      {tool.description}
    </p>
  </div>
);

/** Markdown 渲染样式：与概览设计语言对齐 */
export const McpGuide = ({ guide }: { guide: string }) => (
  <OverviewCard className='gap-0'>
    <CardTitle icon={BookOpen}>操作指南</CardTitle>
    <div className='pt-2'>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className='font-display mb-4 mt-2 text-xl font-bold text-foreground'>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className='font-display mb-3 mt-5 border-b border-border/50 pb-1 text-base font-semibold text-foreground'>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className='font-display mb-2 mt-4 text-sm font-semibold text-foreground'>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className='mb-3 text-sm leading-relaxed text-foreground'>
              {children}
            </p>
          ),
          code: ({ children, className }) => (
            <code
              className={cn(
                'font-mono text-sm',
                !className && 'rounded bg-primary/10 px-1.5 py-0.5 text-primary'
              )}
            >
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className='mb-4 overflow-x-auto rounded-lg border border-border/60 bg-border/40 p-4 font-mono text-sm [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit'>
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className='mb-3 list-inside list-disc space-y-1 text-sm'>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className='mb-3 list-inside list-decimal space-y-1 text-sm'>
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
            <blockquote className='mb-3 border-l-4 border-primary/30 pl-4 text-secondary italic'>
              {children}
            </blockquote>
          ),
          hr: () => <hr className='my-4 border-border/50' />,
          table: ({ children }) => (
            <div className='mb-4 overflow-x-auto'>
              <table className='w-full border-collapse text-sm'>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className='border border-border bg-border/30 px-3 py-2 text-left text-sm font-medium'>
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
  </OverviewCard>
);

const InlineCode = ({ children }: { children: string }) => (
  <code className='rounded bg-primary/10 px-1 py-0.5 font-mono text-xs text-primary'>
    {children}
  </code>
);

const CodeBlock = ({ children }: { children: string }) => (
  <pre className='my-2 overflow-x-auto rounded-lg border border-border/60 bg-border/40 p-3 font-mono text-sm'>
    <code className='text-foreground'>{children}</code>
  </pre>
);

/** 接入 Agent：JSON / CLI 配置片段 */
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
    <OverviewCard>
      <CardTitle icon={Cable}>接入 Agent</CardTitle>
      <div className='flex flex-col text-sm'>
        <p className='mb-1 text-xs text-muted'>
          将以下配置写入 <InlineCode>claude_desktop_config.json</InlineCode>
          （Claude Desktop） 或 <InlineCode>~/.cursor/mcp.json</InlineCode>
          （Cursor）：
        </p>
        <CodeBlock>{jsonSnippet}</CodeBlock>
        <p className='mb-1 text-xs text-muted'>Claude Code：</p>
        <CodeBlock>{cliSnippet}</CodeBlock>
        {tokenEnabled && (
          <p className='text-xs text-muted'>
            将 <InlineCode>YOUR_TOKEN</InlineCode> 替换为后端管理员签发的 Bearer
            Token。
          </p>
        )}
      </div>
    </OverviewCard>
  );
};
