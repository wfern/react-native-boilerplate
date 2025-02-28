import * as React from 'react';
import { TextInput } from 'react-native';
import {
  Mask,
  MaskInputProps,
  useMaskedInputProps,
} from 'react-native-mask-input';

import { Input } from '@/components/input';

export interface MaskedInputProps extends MaskInputProps {
  mask?: Mask;
  onChangeText?: (masked: string, unmasked: string) => void;
}

export const MaskedInput = React.forwardRef<TextInput, MaskedInputProps>(
  ({ mask, value, onChangeText, className, ...props }, ref) => {
    const maskedInputProps = useMaskedInputProps({
      mask,
      value,
      onChangeText,
    });

    return (
      <Input
        ref={ref}
        {...props}
        selection={maskedInputProps.selection}
        value={maskedInputProps.value}
        onChangeText={maskedInputProps.onChangeText}
      />
    );
  },
);

MaskedInput.displayName = 'MaskedInput';
