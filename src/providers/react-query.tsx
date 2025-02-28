/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { AppState, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import {
  focusManager,
  NotifyOnChangeProps,
  onlineManager,
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from '@tanstack/react-query';

interface QueryClientProviderProps {
  children: React.ReactElement;
}

// onlineManager.setEventListener((setOnline) => {
//   return NetInfo.addEventListener((state) => {
//     setOnline(!!state.isConnected);
//   });
// });

export function useRefetchOnAppFocus() {
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
}

export function useRefetchOnScreenFocus<T>(refetch: () => Promise<T> | void) {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch]),
  );
}

/**
 * Stop re-renders when a React Native screen gets out of focus.
 *
 * Example:
 * ```js
 * const notifyOnChangeProps = useFocusNotifyOnChangeProps();
 *
 * const { dataUpdatedAt } = useQuery({
 *   queryKey: ['key'],
 *   queryFn: () => fetch(...),
 *   notifyOnChangeProps,
 * });
 * ```
 */
export function useFocusNotifyOnChangeProps(
  notifyOnChangeProps?: NotifyOnChangeProps,
) {
  const focusedRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      focusedRef.current = true;

      return () => {
        focusedRef.current = false;
      };
    }, []),
  );

  return () => {
    if (!focusedRef.current) {
      return [];
    }

    if (typeof notifyOnChangeProps === 'function') {
      return notifyOnChangeProps();
    }

    return notifyOnChangeProps;
  };
}

/**
 * Disable queries on out of focus screens
 *
 * Example:
 * ```js
 * const isFocused = useQueryFocusAware();
 *
 * const { dataUpdatedAt } = useQuery({
 *   queryKey: ['key'],
 *   queryFn: () => fetch(...),
 *   enabled: isFocused,
 * });
 * ```
 */
export function useQueryFocusAware() {
  const focusedRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      focusedRef.current = true;

      return () => {
        focusedRef.current = false;
      };
    }, []),
  );

  return () => focusedRef.current;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // FIXME: remove before prod
      // gcTime: 0,
    },
  },
});

export default function QueryClientProvider({
  children,
}: QueryClientProviderProps) {
  useRefetchOnAppFocus();

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
}
