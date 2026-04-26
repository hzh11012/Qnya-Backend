import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Link, useLocation } from 'react-router-dom';
import type { NavItem } from '@/links';
import { cn, getTitleByPath } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LinkBreadcrumbProps {
  items: NavItem[];
}

const LinkBreadcrumb: React.FC<LinkBreadcrumbProps> = ({ items }) => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const title = getTitleByPath(items, pathname);
  const homeTitle = getTitleByPath(items, '/');

  const isHomePage = pathname === '/';

  if (isMobile) {
    return <span className='ml-4 text-sm'>{title}</span>;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={'/'}>{homeTitle}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator
          className={cn({ 'hidden': isHomePage || !title })}
        />
        <BreadcrumbItem className={cn({ 'hidden': isHomePage || !title })}>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

LinkBreadcrumb.displayName = 'LinkBreadcrumb';

export default LinkBreadcrumb;
