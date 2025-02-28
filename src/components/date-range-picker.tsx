import React from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import { Pressable } from '@/components/pressable';
import { Text } from '@/components/text';

interface DateRangeContextType {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}

const DateRangePickerContext = React.createContext<DateRangeContextType>({
  startDate: null,
  endDate: null,
  setStartDate: () => {},
  setEndDate: () => {},
});

interface DateRangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onDateChange?: (dates: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
  children: React.ReactNode;
}

export const DateRangePicker = ({
  startDate: startDateProp = null,
  endDate: endDateProp = null,
  onDateChange,
  children,
}: DateRangePickerProps) => {
  const [startDate, setStartDate] = React.useState<Date | null>(startDateProp);
  const [endDate, setEndDate] = React.useState<Date | null>(endDateProp);

  React.useEffect(() => {
    setStartDate(startDateProp);
    setEndDate(endDateProp);
  }, [startDateProp, endDateProp]);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    onDateChange?.({ startDate: date, endDate });
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    onDateChange?.({ startDate, endDate: date });
  };

  return (
    <DateRangePickerContext.Provider
      value={{
        startDate,
        endDate,
        setStartDate: handleStartDateChange,
        setEndDate: handleEndDateChange,
      }}
    >
      {children}
    </DateRangePickerContext.Provider>
  );
};

interface DateRangePickerSelectorProps {
  type: 'start' | 'end';
}

export const DateRangePickerSelector = ({
  type,
}: DateRangePickerSelectorProps) => {
  const { startDate, endDate, setStartDate, setEndDate } = React.useContext(
    DateRangePickerContext,
  );

  const [open, setOpen] = React.useState<boolean>(false);

  const date = type === 'start' ? startDate : endDate;

  let minDate: Date | undefined;
  let maxDate: Date | undefined;

  if (type === 'start') {
    if (endDate) {
      maxDate = endDate;
    }
  } else {
    if (startDate) {
      minDate = startDate;
    }
  }

  const handlePress = () => {
    setOpen(true);
  };

  const handleConfirm = (selectedDate: Date) => {
    setOpen(false);

    if (type === 'start') {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <View>
      <Pressable
        className="h-14 w-full justify-center overflow-hidden rounded-xl border border-border bg-input px-4 py-3"
        onPress={handlePress}
      >
        <Text className="leading-tight">
          {date ? formatDate(date) : 'Selecionar'}
        </Text>
      </Pressable>
      <DatePicker
        modal
        open={open}
        mode="date"
        date={date || new Date()}
        minimumDate={minDate}
        maximumDate={maxDate}
        //
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        //
        title={type === 'start' ? 'Data de início' : 'Data de término'}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </View>
  );
};

// Usage example:
/*
const MyComponent = () => {
  return (
    <DateRangePicker>
      <View className="flex-row space-x-4 p-4">
        <DateRangeSelector type="start" />
        <DateRangeSelector type="end" />
      </View>
    </DateRangePicker>
  );
};
*/
