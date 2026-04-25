import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white',
        muted: 'bg-muted text-white',
        destructive: 'bg-destructive text-white',
        success: 'bg-green-500 dark:bg-green-600 text-white',
        warning: 'bg-yellow-500 dark:bg-yellow-600 text-white'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      data-slot='badge'
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
