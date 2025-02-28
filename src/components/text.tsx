import { Text as NativeText, type TextProps } from 'react-native';

import { classNames } from '@/utils/class-names';

export function Text({ className, ...rest }: TextProps) {
  return (
    <NativeText
      className={classNames('text-foreground', className)}
      {...rest}
    />
  );
}
