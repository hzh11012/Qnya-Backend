import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * 全局 Toast：对齐概览页设计语言
 * - 毛玻璃：半透明 card 底色 + backdrop-blur（呼应 OverviewCard）
 * - 半透明边框 + rounded-xl 圆角（呼应 CARD_BASE）
 * - 图标承载语义色：success 主色 / error destructive / warning 黄（与警示胶囊一致）
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  // 毛玻璃质感对齐 OverviewCard：半透明 card 底色 + toast 上的 backdrop-blur
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      icons={{
        success: <CircleCheckIcon className='size-4 text-primary' />,
        info: <InfoIcon className='size-4 text-muted' />,
        warning: <TriangleAlertIcon className='size-4 text-yellow-500' />,
        error: <OctagonXIcon className='size-4 text-destructive' />,
        loading: <Loader2Icon className='size-4 animate-spin text-primary' />
      }}
      style={
        {
          // Radix 弹窗打开时会给 body 加 pointer-events: none（防点击穿透），
          // toast 会继承到 none 导致弹窗打开时无法交互，这里显式恢复
          pointerEvents: 'auto',
          // 毛玻璃：半透明 card 底色 + toast 上的 backdrop-blur（呼应 OverviewCard）
          '--normal-bg': 'color-mix(in oklab, var(--card) 75%, transparent)',
          '--normal-text': 'var(--foreground)',
          '--normal-border':
            'color-mix(in oklab, var(--border) 60%, transparent)',
          // 与 rounded-xl（--radius + 4px）一致
          '--border-radius': 'calc(var(--radius) + 4px)'
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast backdrop-blur-md',
          title: 'text-sm font-medium tracking-tight',
          description: 'text-muted text-xs',
          actionButton: 'bg-primary text-white',
          cancelButton: 'bg-muted/20 text-muted'
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
