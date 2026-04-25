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

interface NavSubItem {
  title: string;
  icon?: LucideIcon;
  url: string;
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
}

type NavItem = NavItemWithChildren | NavItemWithoutChildren;

const links: NavItem[] = [
  {
    title: '概览',
    icon: Gauge,
    url: '/'
  },
  {
    title: '自动化',
    icon: Bot,
    isActive: true,
    items: [
      {
        title: '资源检索',
        icon: ScanSearch,
        url: '/resources'
      },
      {
        title: '种子记录',
        icon: Sprout,
        url: '/torrents'
      },
      {
        title: '视频任务',
        icon: Timer,
        url: '/tasks'
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
        url: '/topics'
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
        url: '/series'
      },
      {
        title: '番剧',
        icon: Tv,
        url: '/anime'
      },
      {
        title: '剧集',
        icon: Film,
        url: '/videos'
      },
      {
        title: '弹幕',
        icon: MessageCircle,
        url: '/dans'
      },
      {
        title: '标签',
        icon: Tags,
        url: '/tags'
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
        url: '/users'
      },
      {
        title: '追番',
        icon: Bookmark,
        url: '/favorites'
      },
      {
        title: '评分',
        icon: Star,
        url: '/scores'
      },
      {
        title: '观看记录',
        icon: History,
        url: '/histories'
      },
      {
        title: '问题反馈',
        icon: MessageSquareText,
        url: '/feedbacks'
      }
    ]
  },
  {
    title: '平台设置',
    icon: Settings,
    url: '/settings'
  }
];

export { links, type NavItem };
