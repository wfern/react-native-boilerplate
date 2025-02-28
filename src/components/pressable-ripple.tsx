import * as React from 'react';
import {
  Pressable as BasePressable,
  GestureResponderEvent,
  LayoutChangeEvent,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { cssInterop } from 'nativewind';

cssInterop(PressableRipple, {
  className: {
    target: 'style',
  },
});

export function PressableRipple({
  pressColor = '#eee',

  style,
  android_ripple,

  onPressIn,
  onPressOut,

  children,
  ...props
}: React.ComponentProps<typeof BasePressable> & {
  pressColor?: string;
  children: React.ReactNode;
}) {
  const [pressableWidth, setPressableWidth] = React.useState(0);
  const pressableRef = React.useRef<any>();

  const effectScale = useSharedValue(0);
  const effectOpacity = useSharedValue(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setPressableWidth(event.nativeEvent.layout.width);
  };

  const handlePressIn = (event: GestureResponderEvent) => {
    onPressIn?.(event);

    effectScale.set(withTiming(1, { duration: 400 }));
    effectOpacity.set(withTiming(0.4, { duration: 200 }));
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    onPressOut?.(event);

    effectOpacity.set(
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          effectScale.set(0);
        }
      }),
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: effectScale.value }],
    opacity: effectOpacity.value,
  }));

  const borderRadius = (style as ViewStyle)?.borderRadius ?? 0;
  const effectSize = pressableWidth;

  return (
    <BasePressable
      accessibilityRole="button"
      ref={pressableRef}
      onLayout={handleLayout}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
      // disable this shit, it cause more problems than it solves
      android_ripple={undefined}
      {...props}
    >
      <Animated.View
        className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center overflow-hidden"
        style={{ borderRadius }}
      >
        <Animated.View
          className="rounded-full"
          style={[
            {
              width: effectSize,
              height: effectSize,
              backgroundColor: pressColor,
            },
            animatedStyle,
          ]}
        />
      </Animated.View>
      {children}
    </BasePressable>
  );
}
