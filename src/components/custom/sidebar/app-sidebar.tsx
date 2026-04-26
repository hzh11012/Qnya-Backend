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
import { useAuthStore } from '@/store';
import { useRequest } from 'ahooks';
import { logout } from '@/apis';
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

  const { run: onLogout } = useRequest(logout, {
    manual: true,
    debounceWait: 250,
    onFinally: () => {
      setUser(null);
    }
  });

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
