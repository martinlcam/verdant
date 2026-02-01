'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    orientation?: 'horizontal' | 'vertical';
  }
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      'relative flex touch-none select-none items-center',
      orientation === 'vertical' ? 'h-full w-6 flex-col' : 'w-full',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        'relative grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800',
        orientation === 'vertical' ? 'h-full w-2' : 'h-2 w-full',
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          'absolute bg-emerald-500',
          orientation === 'vertical' ? 'w-full' : 'h-full',
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-emerald-500 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-950" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
