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
        warning: 'bg-yellow-500 dark:bg-yellow-600 text-white',
        // 浅色描边款：用于状态/分类这类「看一眼就好」的标记。
        // 实心款（warning/success）在白底上偏刺眼，成组的胶囊尤其明显。
        subtle: 'border-border bg-card text-muted-foreground',
        'subtle-primary': 'border-primary/25 bg-primary/10 text-primary',
        'subtle-success':
          'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        'subtle-warning':
          'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400'
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
