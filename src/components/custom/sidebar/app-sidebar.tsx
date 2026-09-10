import NavHeader from '@/components/custom/sidebar/nav-header';
import NavMain from '@/components/custom/sidebar/nav-main';
import NavUser from '@/components/custom/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from '@/components/ui/sidebar';
import { links } from '@/links';
import { useAuthStore } from '@/store/auth';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/apis/auth';
import { useShallow } from 'zustand/react/shallow';

const AppSideBar: React.FC<React.ComponentProps<typeof Sidebar>> = ({
  ...props
}) => {
  const { name, email, avatar, setUser } = useAuthStore(
    useShallow(state => ({
      name: state.user?.name ?? '',
      email: state.user?.email ?? '',
      avatar: state.user?.avatar ?? '',
      setUser: state.setUser
    }))
  );

  // 登出后无论成败都清除本地用户态（401 会由请求层统一跳登录页）
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      setUser(null);
    }
  });
  const onLogout = () => logoutMutation.mutate();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={links} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name,
            avatar,
            email
          }}
          onLogout={onLogout}
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
