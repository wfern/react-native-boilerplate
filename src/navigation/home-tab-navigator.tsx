import * as React from 'react';
import { Animated, Platform, useAnimatedValue, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import {
  HomeIcon as LucideHomeIcon,
  SettingsIcon as LucideSettingsIcon,
  UserIcon,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { PressableRipple } from '@/components/pressable-ripple';
import { Account } from '@/screens/account';
import { Developer } from '@/screens/developer';
import { Home } from '@/screens/home';

const TAB_ICON_SIZE = 32;

/**
 * A alternative to the old screen option: unmountOnBlur
 */
function RerenderOnFocusScreenLayout({ children }: any) {
  const [key, setKey] = React.useState(0);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (__DEV__ && isFocused) {
      setKey((prevKey) => prevKey + 1);
    }
  }, [isFocused]);

  return <React.Fragment key={key}>{children}</React.Fragment>;
}

export const HomeTabs = createBottomTabNavigator({
  initialRouteName: 'Order',
  screenOptions: {
    headerShown: false,
    tabBarButton: (props) => {
      return <PressableRipple pressColor={colors.primary} {...props} />;
    },
    tabBarStyle: {
      height: Platform.OS === 'ios' ? 64 + 32 : 64,
    },
    tabBarIconStyle: {
      marginTop: 4,
    },
    tabBarLabelStyle: {
      marginTop: 4,
    },
    tabBarActiveTintColor: colors.primary,
  },
  // This is only necessary to remount the tab to test things on mount, e.g:
  // - test and see how charts animation works
  screenLayout: (props) => <RerenderOnFocusScreenLayout {...props} />,
  screens: {
    Account: {
      screen: Account,
      options: {
        title: 'Conta',
        tabBarIcon: ProfileIcon,
      },
    },
    Order: {
      screen: Home,
      options: {
        title: 'Home',
        tabBarIcon: HomeIcon,
      },
    },
    Settings: {
      screen: Developer,
      options: {
        title: 'Settings',
        tabBarIcon: SettingsIcon,
        lazy: false,
      },
    },
  },
});

type IconProps = {
  focused: boolean;
  size: number;
  color: string;
};

function ProfileIcon({ focused, color }: IconProps) {
  const translateAnimationValue = useAnimatedValue(0);

  if (focused) {
    Animated.spring(translateAnimationValue, {
      toValue: 2,
      bounciness: 20,
      useNativeDriver: true,
    }).start(() => {
      translateAnimationValue.setValue(0);
    });
  }

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: translateAnimationValue.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [0, -3, 0],
            }),
          },
        ],
      }}
    >
      <UserIcon color={color} size={TAB_ICON_SIZE} />
    </Animated.View>
  );
}

function HomeIcon({ focused, color }: IconProps) {
  const spinValue = useAnimatedValue(0);

  if (focused) {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      spinValue.setValue(0);
    });
  }

  return (
    <View style={{ overflow: 'hidden' }}>
      <Animated.View
        style={{
          transform: [
            {
              rotateY: spinValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['0deg', '180deg', '360deg'],
              }),
            },
          ],
        }}
      >
        <LucideHomeIcon color={color} size={TAB_ICON_SIZE} />
      </Animated.View>
    </View>
  );
}

function SettingsIcon({ focused, color }: IconProps) {
  const opacityValue = useAnimatedValue(1);

  React.useEffect(() => {
    if (focused) {
      opacityValue.setValue(0);

      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        opacityValue.setValue(1);
      });
    }
  });

  return (
    <Animated.View
      style={{
        opacity: opacityValue,
      }}
    >
      <LucideSettingsIcon color={color} size={TAB_ICON_SIZE} />
    </Animated.View>
  );
}
