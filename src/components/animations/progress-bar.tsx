import * as React from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const EASING = Easing.bezier(0.4, 0.0, 0.2, 1);

export function ProgressBar({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const width = useSharedValue(0);

  React.useEffect(() => {
    const target = currentStep / totalSteps;
    const hasNextTarget = currentStep < totalSteps;

    cancelAnimation(width);

    const animate = (target: number, duration: number) => {
      width.value = withTiming(
        target,
        { duration, easing: EASING },
        (isFinished) => {
          if (isFinished && hasNextTarget) {
            runOnJS(animate)(width.value + 0.035, 300);
          }
        },
      );
    };

    animate(target, 1000);
  }, [currentStep, totalSteps, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View className="h-3 w-full rounded-full bg-neutral-300">
      <Animated.View
        className="h-full rounded-full bg-primary"
        style={animatedStyle}
      />
    </View>
  );
}
