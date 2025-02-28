/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import {
  Animated,
  StyleProp,
  useAnimatedValue,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

const ANIMATION_START_VALUE = 0.4;
const ANIMATION_END_VALUE = 1;

const START_COLOR = '#efefef';
const END_COLOR = '#bfbfbf';

type ContextProps = {
  startColor: string;
  endColor: string;
  animatedStyle: StyleProp<ViewStyle>;
  updateAnimatedStyle: (style: StyleProp<ViewStyle>) => void;
};

export const PlaceholderContext = React.createContext<ContextProps>(
  {} as ContextProps,
);

export const usePlaceholder = () => React.useContext(PlaceholderContext);

export function Placeholder({
  startColor = START_COLOR,
  endColor = END_COLOR,
  children,
}: {
  startColor?: string;
  endColor?: string;
  children: React.ReactNode;
}) {
  const [animatedStyle, setAnimatedStyle] =
    React.useState<StyleProp<ViewStyle>>();

  const updateAnimatedStyle = (style: StyleProp<ViewStyle>) => {
    setAnimatedStyle(style);
  };

  return (
    <PlaceholderContext.Provider
      value={{
        startColor,
        endColor,
        //
        animatedStyle,
        updateAnimatedStyle,
      }}
    >
      {children}
    </PlaceholderContext.Provider>
  );
}

interface PlaceholderFadeAnimationProps {
  /* Animation duration, default is 500 */
  duration?: number;
}

export const PlaceholderFadeAnimation: React.FC<
  PlaceholderFadeAnimationProps
> = ({ duration = 1000 }) => {
  const animation = useAnimatedValue(ANIMATION_START_VALUE);

  const { updateAnimatedStyle } = usePlaceholder();

  const start = React.useCallback(() => {
    Animated.sequence([
      Animated.timing(animation, {
        duration,
        toValue: ANIMATION_END_VALUE,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        duration,
        toValue: ANIMATION_START_VALUE,
        useNativeDriver: true,
      }),
    ]).start((result) => {
      if (result.finished) {
        start();
      }
    });
  }, [animation, duration]);

  React.useEffect(() => {
    start();
  }, [start]);

  React.useEffect(() => {
    const animatedStyle: StyleProp<ViewStyle> = {
      height: '100%',
      backgroundColor: END_COLOR,
      opacity: animation,
    };

    updateAnimatedStyle(animatedStyle);
  }, [animation, updateAnimatedStyle]);

  return null;
};

export interface PlaceholderLineProps extends ViewProps {
  /* The line width in percent, default is 100(%)  */
  width?: number;
  /* The line height, default is 12  */
  height?: number;
  /* The line color, default is #efefef  */
  color?: string;
}

export const PlaceholderLine: React.FC<PlaceholderLineProps> = ({
  width = 100,
  height = 12,
  color,
  style,
}) => {
  const { startColor, animatedStyle } = usePlaceholder();

  const computedStyle: StyleProp<ViewStyle> = {
    width,
    height,
    marginTop: 2,
    marginBottom: 2,
    borderRadius: height / 2,
    backgroundColor: color ?? startColor,
    overflow: 'hidden',
  };

  return (
    <View style={[computedStyle, style]}>
      <Animated.View style={animatedStyle} />
    </View>
  );
};

export interface PlaceholderMediaProps extends ViewProps {
  /* The media size (height / width), default is 40  */
  size?: number;
  /* Defines if the media is rounded or not, default is false */
  isRound?: boolean;
  /* The media color, default is #efefef  */
  color?: string;
  /* Customize the style of the underlying View component */
}

export const PlaceholderMedia: React.FC<PlaceholderMediaProps> = ({
  size = 40,
  isRound = false,
  color = START_COLOR,
  style,
}) => {
  const computedStyles: StyleProp<ViewStyle> = {
    width: size,
    height: size,
    borderRadius: isRound ? size / 2 : 3,
    backgroundColor: color,
    overflow: 'hidden',
  };

  const { animatedStyle } = usePlaceholder();

  return (
    <View style={[computedStyles, style]}>
      <Animated.View style={animatedStyle} />
    </View>
  );
};
