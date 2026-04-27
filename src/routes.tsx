import {
  createBrowserRouter,
  Outlet,
  type RouteObject
} from 'react-router-dom';
import { createLazyComponent } from '@/lib/utils';
import Exception from '@/components/custom/exception';
import Fallback from '@/components/custom/fallback';
import Layout from '@/layout';
import {
  RequireAuth,
  RedirectIfAuthenticated
} from '@/components/custom/auth/auth-guard';
import { AuthProvider } from '@/components/custom/auth/auth-provider';

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
            lazy: createLazyComponent(() => import('@/pages/login/index'))
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
          {
            index: true,
            lazy: createLazyComponent(() => import('@/pages/home/index'))
          },
          {
            path: 'resources',
            lazy: createLazyComponent(() => import('@/pages/resources/index'))
          },
          {
            path: 'torrents',
            lazy: createLazyComponent(() => import('@/pages/torrents/index'))
          },
          {
            path: 'tasks',
            lazy: createLazyComponent(() => import('@/pages/tasks/index'))
          },
          {
            path: 'series',
            lazy: createLazyComponent(() => import('@/pages/series/index'))
          },
          {
            path: 'tags',
            lazy: createLazyComponent(() => import('@/pages/tags/index'))
          },
          {
            path: 'anime',
            lazy: createLazyComponent(() => import('@/pages/anime/index'))
          },
          {
            path: 'users',
            lazy: createLazyComponent(() => import('@/pages/users/index'))
          },
          {
            path: 'favorites',
            lazy: createLazyComponent(() => import('@/pages/favorites/index'))
          },
          {
            path: 'scores',
            lazy: createLazyComponent(() => import('@/pages/scores/index'))
          },
          {
            path: 'topics',
            lazy: createLazyComponent(() => import('@/pages/topics/index'))
          },
          {
            path: 'feedbacks',
            lazy: createLazyComponent(() => import('@/pages/feedbacks/index'))
          },
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
