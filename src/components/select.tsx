import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Picker, PickerProps } from '@react-native-picker/picker';
import { ChevronDownIcon } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Input } from '@/components/input';
import { classNames } from '@/utils/class-names';

function getSelectedLabel(children: React.ReactNode, index: number) {
  const filteredChildren = React.Children.toArray(children).filter(
    (item) => item != null,
  );

  if (index === -1) {
    return 'Selecione uma opção';
  }

  const selectedChildrenProps = (filteredChildren[index] as React.ReactElement)
    .props;

  return selectedChildrenProps.label;
}

function getSelectedIndex(children: React.ReactNode, value: any) {
  return React.Children.toArray(children).findIndex(
    (child) => (child as React.ReactElement).props.value === value,
  );
}

export function Select<T>(props: React.ComponentProps<typeof Picker<T>>) {
  return (
    <View className="h-14 rounded-xl border border-border bg-input pl-2">
      <Picker
        dropdownIconColor={colors.primary}
        selectionColor={colors.primary}
        {...props}
      />
    </View>
  );
}

export function SelectInput<T>({
  children,
  className,
  selectedValue: selectedValueProp,
  onValueChange,
  renderSelectedValue,
  ...props
}: React.ComponentProps<typeof Picker<T>> & {
  renderSelectedValue?: (
    value: T,
    index: number,
    label: string,
  ) => React.ReactNode;
}) {
  const pickerRef = React.useRef<Picker<T>>(null);

  const [selectedValue, setSelectedValue] = React.useState<T | undefined>(
    selectedValueProp,
  );
  const [selectedIndex, setSelectedIndex] = React.useState<number>(() => {
    return getSelectedIndex(children, selectedValueProp);
  });
  const [selectedLabel, setSelectedLabel] = React.useState<string>(() => {
    return getSelectedLabel(children, selectedIndex);
  });

  const handleValueChange: PickerProps<T>['onValueChange'] = (value, index) => {
    const selectedLabel = getSelectedLabel(children, index);

    setSelectedValue(value);
    setSelectedIndex(index);
    setSelectedLabel(selectedLabel);

    onValueChange?.(value, index);
  };

  const handleOpenPicker = () => {
    pickerRef.current?.focus();
  };

  /**
   * This is used to handle the case where the selected value prop is changed from outside the component.
   */
  React.useLayoutEffect(() => {
    if (selectedValueProp && selectedValueProp !== selectedValue) {
      const index = getSelectedIndex(children, selectedValueProp);

      if (index !== -1) {
        setSelectedValue(selectedValueProp);
        setSelectedIndex(index);
        setSelectedLabel(getSelectedLabel(children, index));
      }
    }
  }, [selectedValueProp, selectedValue, children]);

  return (
    <View>
      <Picker
        ref={pickerRef}
        {...props}
        selectedValue={selectedValue}
        onValueChange={handleValueChange}
        style={styles.hidePicker}
      >
        {children}
      </Picker>
      <Pressable onPress={handleOpenPicker}>
        <Input
          editable={false}
          className={classNames('text-foreground', className)}
        >
          {renderSelectedValue?.(
            selectedValue as T,
            selectedIndex,
            selectedLabel,
          ) ?? selectedLabel}
        </Input>
        <View className="absolute bottom-0 right-4 top-0 justify-center">
          <ChevronDownIcon size={18} color={colors.primary} />
        </View>
      </Pressable>
    </View>
  );
}

export function SelectItem(props: React.ComponentProps<typeof Picker.Item>) {
  return <Picker.Item {...props} />;
}

const styles = StyleSheet.create({
  hidePicker: {
    display: 'none',
    opacity: 0,
  },
});
