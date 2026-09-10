import {
  createBrowserRouter,
  Outlet,
  type RouteObject
} from 'react-router-dom';
import Exception from '@/components/custom/exception';
import Fallback from '@/components/custom/fallback';
import Layout from '@/layout';
import {
  RequireAuth,
  RedirectIfAuthenticated
} from '@/components/custom/auth/auth-guard';
import { AuthProvider } from '@/components/custom/auth/auth-provider';
import { links } from '@/links';

/**
 * 从导航配置派生主布局下的路由树
 * links.ts 是路径的唯一数据源，新增页面只需在其中挂上 lazy
 */
const pageRoutes: RouteObject[] = links.flatMap((link): RouteObject[] => {
  // 分组导航：收集子项的路由
  if (link.items) {
    return link.items
      .filter(item => item.lazy)
      .map(item => ({
        path: item.url.replace(/^\//, ''),
        lazy: item.lazy
      }));
  }
  // 顶级导航：'/' 映射为 index 路由，其余去掉前导斜杠
  if (link.lazy) {
    return [
      link.url === '/'
        ? { index: true, lazy: link.lazy }
        : { path: link.url.replace(/^\//, ''), lazy: link.lazy }
    ];
  }
  return [];
});

const staticRoutes: RouteObject[] = [
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: '/login',
        element: (
          <RedirectIfAuthenticated>
            <Outlet />
          </RedirectIfAuthenticated>
        ),
        hydrateFallbackElement: <Fallback />,
        errorElement: <Exception type='error' />,
        children: [
          {
            index: true,
            lazy: () =>
              import('@/pages/login/index').then(m => ({
                Component: m.default
              }))
          }
        ]
      },
      {
        path: '/',
        Component: () => (
          <RequireAuth>
            <Layout />
          </RequireAuth>
        ),
        hydrateFallbackElement: <Fallback />,
        errorElement: <Exception type='error' />,
        children: [
          ...pageRoutes,
          {
            path: '*',
            element: <Exception />
          }
        ]
      }
    ]
  }
];

const router = createBrowserRouter(staticRoutes);

export default router;
