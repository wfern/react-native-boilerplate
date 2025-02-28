import * as React from 'react';
import { Pressable as BasePressable } from 'react-native';

import { classNames } from '@/utils/class-names';

export function Pressable({
  android_ripple,
  className,
  children,
  ...props
}: React.ComponentProps<typeof BasePressable> & {
  children: React.ReactNode;
}) {
  return (
    <BasePressable
      accessibilityRole="button"
      // disable this shit, it cause more problems than it solves
      android_ripple={undefined}
      className={classNames('active:opacity-60', className)}
      {...props}
    >
      {children}
    </BasePressable>
  );
}
