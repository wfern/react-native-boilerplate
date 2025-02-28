import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { Header, HeaderBackButton, HeaderTitle } from '@/components/header';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/text';

export function Home() {
  return (
    <SafeAreaView>
      <Header>
        <HeaderBackButton />
        <HeaderTitle>Home</HeaderTitle>
      </Header>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="p-5"
      >
        <View className="flex gap-4">
          <Text>Home</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
