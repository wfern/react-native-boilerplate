import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { useAppSelector } from '@/redux/store';
import { SafeAreaView } from '@/components/safe-area-view';
import { HomeTabs } from '@/navigation/home-tab-navigator';
import { AccountEdit } from '@/screens/account/edit';
import { Login } from '@/screens/authentication/login';
import { Developer } from '@/screens/developer';

const useIsSignedIn = () => {
  const isSignedIn = useAppSelector(
    (state) => state.authentication.status === 'LOGGED_IN',
  );

  return isSignedIn;
};

const useIsSignedOut = () => {
  const isSignedOut = useAppSelector(
    (state) => state.authentication.status === 'LOGGED_OUT',
  );

  return isSignedOut;
};

const RootStack = createNativeStackNavigator({
  screenOptions: {
    navigationBarColor: '#ffffff',
    animation: 'none',
  },
  screens: {},
  //
  groups: {
    Authentication: {
      if: useIsSignedOut,
      screenOptions: {
        headerShown: false,
      },
      screens: {
        Login: {
          screen: Login,
          options: {
            title: 'Login',
          },
        },
      },
    },
    Home: {
      if: useIsSignedIn,
      screenOptions: {
        headerShown: false,
      },
      screens: {
        HomeTabs: {
          screen: HomeTabs,
          options: {
            title: 'Home',
          },
        },
        'Account/Edit': {
          screen: AccountEdit,
        },
      },
    },
    Settings: {
      if: useIsSignedIn,
      screenOptions: {
        headerShown: false,
      },
      // Screen with `headerShown: false` needs SafeAreaView
      screenLayout: ({ children }) => {
        return <SafeAreaView>{children}</SafeAreaView>;
      },
      screens: {},
    },

    Testing: {
      screenOptions: {
        headerShown: false,
      },
      screens: {
        Developer: {
          screen: Developer,
        },
      },
    },
  },
});

export const NavigationContainer = createStaticNavigation(RootStack);

type NavigationProps = React.ComponentProps<typeof NavigationContainer>;

export const AuthenticatedNavigationContainer = (props: NavigationProps) => {
  const authenticationStatus = useAppSelector(
    (state) => state.authentication.status,
  );

  if (authenticationStatus === 'AUTHENTICATING') {
    return null;
  }

  return <NavigationContainer {...props} />;
};

type RootStackParamList = StaticParamList<typeof RootStack>;

export type RootNavigationProp<
  T extends keyof RootStackParamList = keyof RootStackParamList,
> = NativeStackNavigationProp<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
