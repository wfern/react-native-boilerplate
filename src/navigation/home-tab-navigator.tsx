import * as React from 'react';
import { Animated, Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import {
  HomeIcon as LucideHomeIcon,
  SettingsIcon as LucideSettingsIcon,
  UserIcon,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { PressableScale } from '@/components/pressable-scale';
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
      return <PressableScale {...props} />;
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
  return (
    <Animated.View>
      <UserIcon color={color} size={TAB_ICON_SIZE} />
    </Animated.View>
  );
}

function HomeIcon({ focused, color }: IconProps) {
  return (
    <View style={{ overflow: 'hidden' }}>
      <Animated.View>
        <LucideHomeIcon color={color} size={TAB_ICON_SIZE} />
      </Animated.View>
    </View>
  );
}

function SettingsIcon({ focused, color }: IconProps) {
  return (
    <Animated.View>
      <LucideSettingsIcon color={color} size={TAB_ICON_SIZE} />
    </Animated.View>
  );
}
