import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
        secondary:
          'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
        destructive: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        warning:
          'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
        outline: 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300',
        extreme: 'border-transparent bg-red-600 text-white',
        high: 'border-transparent bg-orange-500 text-white',
        moderate: 'border-transparent bg-yellow-500 text-gray-900',
        low: 'border-transparent bg-green-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
