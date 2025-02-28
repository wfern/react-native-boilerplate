/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { classNames } from '@/utils/class-names';

const TIMEOUT = 5e3;

/**
 * Returns a stable callback that always has access to the latest version of the provided function,
 * without causing re-renders when props/state change.
 */
function useNonReactiveCallback<T extends Function>(fn: T): T {
  const ref = React.useRef(fn);

  React.useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);

  return React.useCallback(
    (...args: any) => {
      const latestFn = ref.current;
      return latestFn(...args);
    },
    [ref],
  ) as unknown as T;
}

export type ToastPosition = 'top' | 'bottom';

export function Toast({
  visible = true,

  position = 'bottom',
  offset = 16,

  autoHide = true,
  autoHideTime = TIMEOUT,

  className,
  style,
  children,
  onDestroy = () => {},
}: {
  visible?: boolean;

  position?: ToastPosition;
  offset?: number;

  autoHide?: boolean;
  autoHideTime?: number;

  className?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  onDestroy?: () => void;
}) {
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

  const [cardHeight, setCardHeight] = React.useState(0);

  const isPanning = useSharedValue(false);
  const dismissSwipeTranslateY = useSharedValue(0);

  // for the exit animation to work on iOS the animated component
  // must not be the root component
  // so we need to wrap it in a view and unmount the toast ahead of time
  const [alive, setAlive] = React.useState(true);

  const hideAndDestroyImmediately = () => {
    setAlive(false);
    setTimeout(() => {
      onDestroy();
    }, 1e3);
  };

  const destroyTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const hideAndDestroyAfterTimeout = useNonReactiveCallback(() => {
    clearTimeout(destroyTimeoutRef.current);
    destroyTimeoutRef.current = setTimeout(
      hideAndDestroyImmediately,
      autoHideTime,
    );
  });

  const pauseDestroy = useNonReactiveCallback(() => {
    clearTimeout(destroyTimeoutRef.current);
  });

  React.useEffect(() => {
    if (!autoHide) return;
    hideAndDestroyAfterTimeout();
  }, [autoHide, hideAndDestroyAfterTimeout]);

  const panGesture = React.useMemo(() => {
    return Gesture.Pan()
      .activeOffsetY([-10, 10])
      .failOffsetX([-10, 10])
      .maxPointers(1)
      .onStart(() => {
        'worklet';
        if (!alive) return;
        isPanning.set(true);
        runOnJS(pauseDestroy)();
      })
      .onUpdate((e) => {
        'worklet';
        if (!alive) return;
        dismissSwipeTranslateY.value = e.translationY;
      })
      .onEnd((e) => {
        'worklet';
        if (!alive) return;
        runOnJS(hideAndDestroyAfterTimeout)();
        isPanning.set(false);

        const velocityThreshold = position === 'top' ? -100 : 100;
        const isSwipingInCorrectDirection =
          position === 'top'
            ? e.velocityY < velocityThreshold
            : e.velocityY > velocityThreshold;

        if (isSwipingInCorrectDirection) {
          if (dismissSwipeTranslateY.value === 0) {
            dismissSwipeTranslateY.value = position === 'top' ? 1 : -1;
          }
          dismissSwipeTranslateY.value = withDecay({
            velocity: e.velocityY,
            velocityFactor: Math.max(3500 / Math.abs(e.velocityY), 1),
            deceleration: 1,
          });
        } else {
          dismissSwipeTranslateY.value = withSpring(0, {
            stiffness: 500,
            damping: 50,
          });
        }
      });
  }, [
    dismissSwipeTranslateY,
    isPanning,
    alive,
    hideAndDestroyAfterTimeout,
    pauseDestroy,
    position,
  ]);

  const topOffset = topInset + offset;
  const bottomOffset = bottomInset + offset;

  // This hook monitors the swipe gesture and destroys the toast when it's swiped far enough
  useAnimatedReaction(
    () => {
      const translation = dismissSwipeTranslateY.get();
      const threshold =
        position === 'top'
          ? -topOffset - cardHeight
          : bottomOffset + cardHeight;
      return (
        !isPanning.get() &&
        (position === 'top' ? translation < threshold : translation > threshold)
      );
    },
    (isSwipedAway, prevIsSwipedAway) => {
      'worklet';
      if (isSwipedAway && !prevIsSwipedAway) {
        runOnJS(onDestroy)();
      }
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    const translation = dismissSwipeTranslateY.get();
    const isResistingDirection =
      (position === 'top' && translation > 0) ||
      (position === 'bottom' && translation < 0);

    const translateY = isResistingDirection
      ? Math.sign(translation) * Math.abs(translation) ** 0.7
      : translation;

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <GestureHandlerRootView
      style={{
        position: 'absolute',
        ...(position === 'top' ? { top: topOffset } : { bottom: bottomOffset }),
        left: 0,
        right: 0,
        zIndex: 100,
        minHeight: cardHeight,
        backgroundColor: 'transparent',
      }}
      pointerEvents="box-none"
    >
      {alive && (
        <Animated.View
          entering={position === 'top' ? SlideInUp : SlideInDown}
          exiting={position === 'top' ? SlideOutUp : SlideOutDown}
        >
          <Animated.View
            onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
            accessibilityRole="alert"
            className={classNames(
              'mx-4 rounded-xl border border-card-border bg-card shadow-md',
              className,
            )}
            style={[animatedStyle, style]}
          >
            <GestureDetector gesture={panGesture}>
              <View>{children}</View>
            </GestureDetector>
          </Animated.View>
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
}

export function ToastContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      className={classNames(
        'flex flex-row items-center gap-4 px-3 py-3',
        className,
      )}
    >
      {children}
    </View>
  );
}

export function ToastIcon({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      className={classNames(
        'flex h-8 w-8 items-center justify-center rounded-full bg-primary',
        className,
      )}
    >
      {children}
    </View>
  );
}

type ToastType = (onClose: () => void) => React.ReactNode;

type ToastManagerType = {
  addToast: (toast: ToastType) => void;
  removeToast: (id: number) => void;
};

export let ImperativeToastManager = {} as ToastManagerType;

export const Toaster = {
  show: (toast: (onClose: () => void) => React.ReactNode) => {
    ImperativeToastManager.addToast(toast);
  },
};

export function ToastManager() {
  const [toasts, setToasts] = React.useState<
    {
      id: number;
      toast: ToastType;
    }[]
  >([]);

  const addToast = React.useCallback((toast: ToastType) => {
    setToasts((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        toast,
      },
    ]);
  }, []);

  const removeToast = React.useCallback(
    (id: number) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    },
    [setToasts],
  );

  React.useEffect(() => {
    ImperativeToastManager = { addToast, removeToast };

    return () => {
      ImperativeToastManager = {} as ToastManagerType;
    };
  }, [addToast, removeToast]);

  return (
    <View className="absolute bottom-0 left-0 right-0 top-0">
      {toasts.map((toast) => (
        <React.Fragment key={toast.id}>
          {toast.toast(() => removeToast(toast.id))}
        </React.Fragment>
      ))}
    </View>
  );
}
