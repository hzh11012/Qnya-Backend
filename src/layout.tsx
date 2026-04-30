import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import ThemeSwitch from '@/components/custom/theme-switch';
import AppSidebar from '@/components/custom/sidebar/app-sidebar';
import LinkBreadcrumb from '@/components/custom/link-breadcrumb';
import { links } from '@/links';

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex bg-background h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
          <div className='flex items-center px-4'>
            <SidebarTrigger className='md:hidden' />
            <LinkBreadcrumb items={links} />
          </div>
          <div className='flex items-center px-4 pr-6'>
            <ThemeSwitch className='cursor-pointer' />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 md:pr-6 pb-4 md:pb-2'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
