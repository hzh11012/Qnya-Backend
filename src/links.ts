import {
  Bookmark,
  Bot,
  Film,
  Gauge,
  History,
  Library,
  ListVideo,
  MessageCircle,
  MessageSquareText,
  Network,
  ScanSearch,
  Settings,
  Sparkles,
  Sprout,
  Star,
  Store,
  Tags,
  Timer,
  Tv,
  UserCircle,
  Users,
  type LucideIcon
} from 'lucide-react';
import { createLazyComponent } from '@/lib/utils';

interface NavSubItem {
  title: string;
  icon?: LucideIcon;
  url: string;
  /**
   * 页面懒加载器（react-router lazy 形态）
   * 路由树由此派生，见 routes.tsx
   */
  lazy?: () => Promise<{ Component: React.ComponentType }>;
}

interface NavItemBase {
  title: string;
  icon?: LucideIcon;
  isActive?: boolean;
}

interface NavItemWithChildren extends NavItemBase {
  items: NavSubItem[];
  url?: string;
}

interface NavItemWithoutChildren extends NavItemBase {
  items?: never;
  url: string;
  lazy?: () => Promise<{ Component: React.ComponentType }>;
}

type NavItem = NavItemWithChildren | NavItemWithoutChildren;

const links: NavItem[] = [
  {
    title: '概览',
    icon: Gauge,
    url: '/',
    lazy: createLazyComponent(() => import('@/pages/home/index'))
  },
  {
    title: '自动化',
    icon: Bot,
    isActive: true,
    items: [
      {
        title: '资源检索',
        icon: ScanSearch,
        url: '/resources',
        lazy: createLazyComponent(() => import('@/pages/resources/index'))
      },
      {
        title: '种子记录',
        icon: Sprout,
        url: '/torrents',
        lazy: createLazyComponent(() => import('@/pages/torrents/index'))
      },
      {
        title: '视频任务',
        icon: Timer,
        url: '/tasks',
        lazy: createLazyComponent(() => import('@/pages/tasks/index'))
      }
    ]
  },
  {
    title: '运营中心',
    icon: Store,
    isActive: true,
    items: [
      {
        title: '专题推荐',
        icon: Sparkles,
        url: '/topics',
        lazy: createLazyComponent(() => import('@/pages/topics/index'))
      }
    ]
  },
  {
    title: '媒体内容',
    icon: Library,
    isActive: true,
    items: [
      {
        title: '系列',
        icon: ListVideo,
        url: '/series',
        lazy: createLazyComponent(() => import('@/pages/series/index'))
      },
      {
        title: '番剧',
        icon: Tv,
        url: '/anime',
        lazy: createLazyComponent(() => import('@/pages/anime/index'))
      },
      {
        title: '剧集',
        icon: Film,
        url: '/videos',
        lazy: createLazyComponent(() => import('@/pages/videos/index'))
      },
      {
        title: '弹幕',
        icon: MessageCircle,
        url: '/dans',
        lazy: createLazyComponent(() => import('@/pages/dans/index'))
      },
      {
        title: '标签',
        icon: Tags,
        url: '/tags',
        lazy: createLazyComponent(() => import('@/pages/tags/index'))
      }
    ]
  },
  {
    title: '会员体系',
    icon: Users,
    isActive: true,
    items: [
      {
        title: '账户',
        icon: UserCircle,
        url: '/users',
        lazy: createLazyComponent(() => import('@/pages/users/index'))
      },
      {
        title: '追番',
        icon: Bookmark,
        url: '/favorites',
        lazy: createLazyComponent(() => import('@/pages/favorites/index'))
      },
      {
        title: '评分',
        icon: Star,
        url: '/scores',
        lazy: createLazyComponent(() => import('@/pages/scores/index'))
      },
      {
        title: '观看记录',
        icon: History,
        url: '/histories',
        lazy: createLazyComponent(() => import('@/pages/histories/index'))
      },
      {
        title: '问题反馈',
        icon: MessageSquareText,
        url: '/feedbacks',
        lazy: createLazyComponent(() => import('@/pages/feedbacks/index'))
      }
    ]
  },
  {
    title: 'MCP',
    icon: Network,
    url: '/mcp',
    lazy: createLazyComponent(() => import('@/pages/mcp/index'))
  },
  {
    title: '系统信息',
    icon: Settings,
    url: '/settings',
    lazy: createLazyComponent(() => import('@/pages/settings/index'))
  }
];

export { links, type NavItem };
