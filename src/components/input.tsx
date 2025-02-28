import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';

import { colors } from '@/constants/colors';
import { classNames } from '@/utils/class-names';

export interface InputProps extends TextInputProps {}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, multiline, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline={multiline}
        cursorColor={colors.primary}
        selectionColor={colors.primaryHover}
        selectionHandleColor={colors.primary}
        className={classNames(
          'w-full rounded-xl border border-border bg-input px-4 py-3',
          // TODO: use variants or tailwind-merge to handle it properly
          multiline ? 'h-auto min-h-14' : 'h-14',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
