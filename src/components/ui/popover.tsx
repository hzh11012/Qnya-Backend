import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

function Popover({
  modal = true,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return (
    <PopoverPrimitive.Root
      data-slot='popover'
      modal={modal}
      {...props}
    />
  );
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverPrimitive.Trigger
      data-slot='popover-trigger'
      {...props}
    />
  );
}

function PopoverContent({
  className,
  align = 'start',
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot='popover-content'
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-popover border-border text-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 flex flex-col gap-2.5 rounded-md p-2.5 text-sm ring-1 duration-100 z-50 w-72 min-w-32 origin-(--radix-popover-content-transform-origin) outline-hidden select-none',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
