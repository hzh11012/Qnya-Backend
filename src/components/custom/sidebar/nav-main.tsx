import { ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import type { NavItem } from '@/links';

interface NavMainProps {
  items: NavItem[];
}

// 有子菜单的导航项
const NavItemWithSub: React.FC<{ item: NavItem }> = ({ item }) => (
  <Collapsible
    defaultOpen={item.isActive}
    className='group/collapsible'
    asChild
  >
    <SidebarMenuItem>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton tooltip={item.title}>
          {item.icon && <item.icon />}
          <span className='whitespace-nowrap'>{item.title}</span>
          <ChevronRight className='ml-auto transition-transform duration-100 group-data-[state=open]/collapsible:rotate-90' />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items?.map(subItem => {
            const subLink = item.url ? item.url + subItem.url : subItem.url;
            return (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild>
                  <Link to={subLink}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
);

// 无子菜单的导航项
const NavItemSimple: React.FC<{ item: NavItem }> = ({ item }) => (
  <SidebarMenuItem>
    <SidebarMenuButton
      tooltip={item.title}
      asChild
    >
      <Link to={item.url!}>
        {item.icon && <item.icon />}
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

const NavMain: React.FC<NavMainProps> = ({ items }) => {
  const renderedItems = items.map(item =>
    item.items ? (
      <NavItemWithSub
        key={item.title}
        item={item}
      />
    ) : (
      <NavItemSimple
        key={item.title}
        item={item}
      />
    )
  );

  return (
    <SidebarGroup>
      <SidebarMenu>{renderedItems}</SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
