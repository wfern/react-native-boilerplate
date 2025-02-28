import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';

export function SafeAreaView({ style, ...props }: ViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <React.Fragment>
      <View
        style={{
          flex: 0,
          paddingTop: insets.top,
          backgroundColor: colors.primary,
        }}
      />
      <View
        {...props}
        style={[
          {
            flex: 1,

            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
          style,
        ]}
      >
        {props.children}
      </View>
    </React.Fragment>
  );
}
