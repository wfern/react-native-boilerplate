import * as React from 'react';
import { FlatList as BaseFlatList, View } from 'react-native';

import { Text } from '@/components/text';

function InnerFlatList<T>(
  props: React.ComponentProps<typeof BaseFlatList<T>>,
  ref: React.ForwardedRef<BaseFlatList<T>>,
) {
  return (
    <BaseFlatList
      ref={ref}
      className="flex-1"
      contentContainerClassName="p-5"
      ListEmptyComponent={ListEmptyComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
      {...props}
      // FIXME: https://github.com/software-mansion/react-native-screens/pull/2596
      removeClippedSubviews={false}
    />
  );
}

export const FlatList = React.forwardRef(InnerFlatList) as <T>(
  props: React.ComponentProps<typeof BaseFlatList<T>> & {
    ref?: React.ForwardedRef<BaseFlatList<T>>;
  },
) => React.ReactElement;

function ItemSeparatorComponent() {
  return <View className="h-4" />;
}

function ListEmptyComponent() {
  return (
    <View className="flex-1 items-center justify-center p-5">
      <Text>Nenhum item encontrado</Text>
    </View>
  );
}
