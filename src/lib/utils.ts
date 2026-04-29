import type { NavItem } from '@/links';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 懒加载组件
 */
export const createLazyComponent = (
  importFn: () => Promise<{ default: React.ComponentType }>
) => {
  return async () => ({
    Component: (await importFn()).default
  });
};

/**
 * 根据路径获取标题
 * @param items 菜单数据
 * @param path 当前路径
 */
export const getTitleByPath = (items: NavItem[], path: string) => {
  const search = (items: NavItem[], basePath: string): string => {
    for (const item of items) {
      if (item.url) {
        // 拼接当前项的完整路径，并处理多余的斜杠
        const currentPath = `${basePath}${item.url}`.replace(/\/+/g, '/');
        // 匹配成功则返回标题
        if (currentPath === path) {
          return item.title;
        }
      }

      // 递归搜索子项，传入新的基础路径（当前路径末尾添加斜杠）
      if (item.items) {
        const nextBasePath = item.url
          ? `${basePath}${item.url}/`.replace(/\/+/g, '/')
          : basePath;
        const result = search(item.items, `${nextBasePath}/`);
        if (result) {
          return result;
        }
      }
    }
    return '';
  };
  return search(items, '');
};

/**
 * 格式化日期
 * @param date 时间戳
 */
export const formatDate = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');

  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
};

/**
 * 格式化文件大小
 * @param size 文件大小
 * @param unit 单位，'byte' 或 'kb'，默认 'byte'
 */
export const formatFileSize = (size: number, unit: 'byte' | 'kb' = 'byte') => {
  if (size === 0) return '0 B';

  // 如果单位是 KB，先转换为字节
  const bytes = unit === 'kb' ? size * 1024 : size;

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(2);
    return fixed.endsWith('.00') ? Math.floor(num).toString() : fixed;
  };

  if (bytes >= GB) {
    return formatNumber(bytes / GB) + ' GB';
  } else if (bytes >= MB) {
    return formatNumber(bytes / MB) + ' MB';
  } else if (bytes >= KB) {
    return formatNumber(bytes / KB) + ' KB';
  } else {
    return formatNumber(bytes) + ' B';
  }
};

/**
 * 格式化秒数为 [hh:]mm:ss，小时为 0 时省略
 * @param seconds 秒数
 */
export const formatDuration = (seconds: number) => {
  const t = Math.max(0, Math.floor(seconds));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
};

/**
 * 创建映射对象
 * @param arr 数组
 */
export const createMap = (arr: { label: string; value: string }[]) => {
  return arr.reduce(
    (map, item) => {
      const { label, value } = item;
      map[value] = label;
      return map;
    },
    {} as { [key: string]: string }
  );
};
