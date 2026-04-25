import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { PanelLeftIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  SidebarContext,
  useSidebar,
  type SidebarContextProps
} from '@/components/ui/sidebar-context';

const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, open]
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile(open => !open) : setOpen(open => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot='sidebar-wrapper'
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style
            } as React.CSSProperties
          }
          className={cn('flex min-h-svh w-full', className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet
        open={openMobile}
        onOpenChange={setOpenMobile}
        {...props}
      >
        <SheetContent
          aria-describedby={undefined}
          data-sidebar='sidebar'
          data-slot='sidebar'
          data-mobile='true'
          className='bg-card text-foreground w-(--sidebar-width) p-0 [&>button]:hidden'
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE
            } as React.CSSProperties
          }
          side='left'
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>导航菜单</SheetTitle>
          </SheetHeader>
          <div className='flex h-full w-full flex-col'>{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className='group peer text-foreground hidden md:block'
      data-state={state}
      data-collapsible={state === 'collapsed' ? 'icon' : ''}
      data-slot='sidebar'
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot='sidebar-gap'
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-100 ease-linear',
          'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
        )}
      />
      <div
        data-slot='sidebar-container'
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-100 ease-linear md:flex',
          'left-0 p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]',
          className
        )}
        {...props}
      >
        <div
          data-sidebar='sidebar'
          data-slot='sidebar-inner'
          className='bg-card flex size-full flex-col rounded-md border'
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClick?.(e);
    toggleSidebar();
  };

  return (
    <Button
      variant='ghost'
      size='link'
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      className={cn(
        "size-5.5 [&_svg:not([class*='size-'])]:size-5.5",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <PanelLeftIcon className='cn-rtl-flip' />
    </Button>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot='sidebar-inset'
      className={cn(
        'bg-background relative flex w-full flex-1 flex-col overflow-hidden',
        className
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='sidebar-header'
      data-sidebar='header'
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='sidebar-footer'
      data-sidebar='footer'
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='sidebar-content'
      data-sidebar='content'
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='sidebar-group'
      data-sidebar='group'
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot='sidebar-menu'
      data-sidebar='menu'
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot='sidebar-menu-item'
      data-sidebar='menu-item'
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  'peer/menu-button cursor-pointer select-none flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-ring transition-[width,height,padding] hover:bg-border focus-visible:ring-2 active:bg-border disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-border data-[active=true]:font-medium data-[state=open]:hover:bg-border group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-border'
      },
      size: {
        default: 'h-8 text-sm',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot.Root : 'button';
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot='sidebar-menu-button'
      data-sidebar='menu-button'
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side='right'
        align='center'
        hidden={state !== 'collapsed' || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot='sidebar-menu-sub'
      data-sidebar='menu-sub'
      className={cn(
        'border-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot='sidebar-menu-sub-item'
      data-sidebar='menu-sub-item'
      className={cn('group/menu-sub-item relative', className)}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive = false,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean;
  size?: 'sm' | 'md';
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'a';

  return (
    <Comp
      data-slot='sidebar-menu-sub-button'
      data-sidebar='menu-sub-button'
      data-size={size}
      data-active={isActive}
      className={cn(
        'text-foreground ring-ring hover:bg-border active:bg-border flex h-8 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden select-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
        'data-[active=true]:bg-border',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger
};
