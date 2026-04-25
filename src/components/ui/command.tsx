import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon, CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot='command'
      className={cn(
        'bg-popover text-foreground rounded-md flex size-full flex-col overflow-hidden',
        className
      )}
      {...props}
    />
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot='command-input-wrapper'
      className='flex items-center py-2 pr-2 pl-2.5 gap-2 min-h-9 border-b'
    >
      <SearchIcon className='size-4 shrink-0 text-button-foreground' />
      <CommandPrimitive.Input
        data-slot='command-input'
        className={cn(
          'w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 selection:bg-primary selection:text-white',
          className
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot='command-list'
      className={cn(
        'no-scrollbar max-h-56 scroll-py-1 outline-none overflow-x-hidden overflow-y-auto',
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot='command-empty'
      className={cn('py-6 text-center text-sm', className)}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot='command-group'
      className={cn('text-foreground overflow-hidden p-1', className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot='command-item'
      className={cn(
        "data-[selected=true]:bg-border data-[selected=true]:text-foreground data-[selected=true]:*:[svg]:text-foreground relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-md! [&_svg:not([class*='size-'])]:size-4 group/command-item data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <CheckIcon className='ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100' />
    </CommandPrimitive.Item>
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
};
