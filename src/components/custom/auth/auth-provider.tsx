import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Exception from '@/components/custom/exception';
import useDeferredLoading from '@/hooks/use-deferred-loading';
import { useAuthInit } from '@/hooks/use-auth-init';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 启动时校验登录态并同步 store
  const { isInitialized, setUser } = useAuthInit();
  const showLoading = useDeferredLoading(!isInitialized);

  // 用 ref 持有最新 location，事件监听器只注册一次，
  // 避免随路由切换反复卸载/重挂监听
  const locationRef = useRef(location);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    const handleUnauthorized = () => {
      // 清除用户状态
      setUser(null);

      // 如果不在登录页，则重定向到登录页
      const { pathname, search } = locationRef.current;
      if (pathname !== '/login') {
        navigate(`/login?redirect=${encodeURIComponent(pathname + search)}`, {
          replace: true
        });
      }
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [navigate, setUser]);

  if (!isInitialized) {
    return showLoading ? <Exception type='loading' /> : null;
  }

  return <>{children}</>;
};

export { AuthProvider };
