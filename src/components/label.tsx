import * as React from 'react';
import { TextProps } from 'react-native';

import { Text } from '@/components/text';
import { classNames } from '@/utils/class-names';

export interface LabelProps extends TextProps {}

export const Label = ({ className, ...props }: LabelProps) => (
  <Text
    className={classNames('mb-1', className)}
    style={{
      fontFamily: 'sans-serif-medium',
    }}
    {...props}
  />
);

Label.displayName = 'Label';
