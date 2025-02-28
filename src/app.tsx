import * as React from 'react';
import BootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import AuthenticationProvider from '@/providers/authentication';
import QueryClientProvider from '@/providers/react-query';

import { colors } from '@/constants/colors';
import { store } from '@/redux/store';
import { AuthenticatedNavigationContainer } from '@/navigation/navigation';

import '../global.css';

function App() {
  // const scheme = useColorScheme();

  const onNavigationReady = () => {
    BootSplash.hide({ fade: true });
  };

  return (
    <ReduxProvider store={store} stabilityCheck="always">
      <QueryClientProvider>
        <AuthenticationProvider>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <GestureHandlerRootView>
              <StatusBar style="light" backgroundColor={colors.primary} />
              <AuthenticatedNavigationContainer
                // theme={scheme === 'dark' ? darkTheme : theme}
                linking={{
                  enabled: 'auto',
                  prefixes: ['boilerplate-app://'],
                }}
                onReady={onNavigationReady}
              />
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </AuthenticationProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;

// const AppWithSentry = Sentry.wrap(App);

// export default AppWithSentry;
