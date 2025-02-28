import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Input } from '@/components/input';
import { Text } from '@/components/text';
import { classNames } from '@/utils/class-names';

const currencyOptions: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 2,
};

function cleanValue(value: string | number): string {
  let cleanedValue = value
    .toString()
    // remove everything that's not a digit or a minus sign
    .replace(/[^\d-]/g, '')
    // remove any minus sign that is NOT at the start
    .replace(/(?!^)-/g, '');

  // if the string is empty or only a dash "-", return "0"
  if (cleanedValue === '' || cleanedValue === '-') {
    return '0';
  }

  // // if the string is entirely zeros, return "0"
  if (/^0+$/.test(cleanedValue)) {
    return '0';
  }

  // remove leading zeros
  cleanedValue = cleanedValue.replace(/^0+/, '');

  return cleanedValue;
}

/**
 * It receives a value: "1000" (string) and return: 10 (number);
 * It mostly come from the TextInput onChangeText value as a string.
 */
function parseValueDown(value: string): number {
  let numericValue =
    Number(value) / 10 ** (currencyOptions.maximumFractionDigits ?? 2);

  return numericValue;
}

/**
 * It receives a value: 10 (number) and return: "1000" (string);
 * It mostly come from the outside as value prop as a number,
 * so we convert and set it to the TextInput value.
 */
function parseValueUp(value: number): number {
  let numericValue =
    Number(value) * 10 ** (currencyOptions.maximumFractionDigits ?? 2);

  return numericValue;
}

function maskValue(value: number): string {
  return new Intl.NumberFormat('pt-BR', currencyOptions).format(value);
}

type CurrencyInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'onChangeText' | 'value'
> & {
  textClassName?: string;

  value: number;
  onChangeValue: (value: number, maskedValue: string) => void;
};

export function CurrencyInput({
  value,
  onChangeValue,
  className,
  textClassName,
  ...props
}: CurrencyInputProps) {
  const [maskedValue, setMaskedValue] = React.useState<string>('');

  const [inputValue, setInputValue] = React.useState<string>('');

  const inputRef = React.useRef<TextInput>(null);

  const prevValueRef = React.useRef<number>();

  React.useLayoutEffect(() => {
    // exit if the value prop is equal to the internal value
    if (value === prevValueRef.current) {
      return;
    }

    const inputValue = parseValueUp(value).toString();

    const maskedValue = maskValue(value);

    onChangeValue?.(value, maskedValue);

    setInputValue(inputValue);
    setMaskedValue(maskedValue);

    // console.log('useEffect value:', value, typeof value);
    // console.log('useEffect parsed:', inputValue, typeof inputValue);
    // console.log('useEffect masked:', maskedValue, typeof maskedValue);
  }, [value, onChangeValue]);

  const handleInputChangeText = (text: string) => {
    const cleanedValue = cleanValue(text);
    const parsedValue = parseValueDown(cleanedValue);
    const maskedValue = maskValue(parsedValue);

    prevValueRef.current = parsedValue;

    setInputValue(cleanedValue);
    setMaskedValue(maskedValue);
    onChangeValue?.(parsedValue, maskedValue);

    // console.log('onInput cleaned:', cleanedValue, typeof cleanedValue);
    // console.log('onInput parsed:', parsedValue, typeof parsedValue);
    // console.log('onInput masked:', maskedValue, typeof maskedValue);
  };

  return (
    <View className={classNames(className, 'relative')}>
      <Input
        ref={inputRef}
        {...props}
        keyboardType="number-pad"
        selectionColor="transparent"
        caretHidden
        contextMenuHidden
        className="color-input"
        // this is necessary to keep the value clean, if not the user could
        // type a lot of shit like dashes and fuck the backspace because
        // internally it would look like this: "123------023".
        value={inputValue}
        onChangeText={handleInputChangeText}
      />
      <Pressable
        className="absolute size-full justify-center px-4"
        onPress={() => inputRef.current?.focus()}
      >
        <Text className={textClassName}>{maskedValue}</Text>
      </Pressable>
    </View>
  );
}
