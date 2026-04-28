import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import Logo from '@/components/custom/logo';
import { LineShadowText } from '@/components/ui/line-shadow-text';

const NavHeader = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='cursor-default'
          asChild
        >
          <div className='select-none'>
            <div className='flex size-8 items-center justify-center'>
              <Logo type='favicon' />
            </div>
            <div className='flex flex-col gap-1 leading-none'>
              <span className='font-semibold whitespace-nowrap'>
                Q
                <LineShadowText
                  className='italic'
                  shadowColor='var(--primary)'
                >
                  nya
                </LineShadowText>
              </span>
              <span className='text-xs whitespace-nowrap'>后台管理中心</span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavHeader;
