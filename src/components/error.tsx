import * as React from 'react';
import { Animated, useAnimatedValue, View } from 'react-native';

import { colors } from '@/constants/colors';
import { Text } from '@/components/text';
import { classNames } from '@/utils/class-names';

export function Error({ children, className }: any) {
  return (
    <View
      className={classNames(
        'flex-1 items-center justify-center p-5',
        className,
      )}
    >
      {children}
    </View>
  );
}

export function ErrorIcon({ children }: any) {
  const iconAnimationValue = useAnimatedValue(0);

  const animateIcon = React.useCallback(() => {
    iconAnimationValue.setValue(0);

    Animated.timing(iconAnimationValue, {
      duration: 1500,
      toValue: 2,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        animateIcon();
      }
    });
  }, [iconAnimationValue]);

  React.useEffect(() => {
    animateIcon();
  }, [animateIcon]);

  return (
    <Animated.View
      className="mb-4"
      style={{
        transform: [
          {
            translateY: iconAnimationValue.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [-10, 0, -10],
            }),
          },
        ],
      }}
    >
      {children({ size: 80, color: colors.primary })}
    </Animated.View>
  );
}

export function ErrorTitle({ children }: any) {
  return (
    <Text className="mb-1 text-center text-xl font-semibold">{children}</Text>
  );
}

export function ErrorDescription({ children }: any) {
  return (
    <Text className="mb-4 text-center text-muted-foreground">{children}</Text>
  );
}
