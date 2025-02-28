import * as React from 'react';
import { TextProps } from 'react-native';

import { Text } from '@/components/text';
import { classNames } from '@/utils/class-names';

export interface InputMessageProps extends TextProps {}

export const InputMessage = ({ className, ...props }: InputMessageProps) => {
  return <Text className={classNames('text-red-600', className)} {...props} />;
};
