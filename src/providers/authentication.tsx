/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { Alert } from 'react-native';

import { AsyncStorage } from '@/lib/async-storage';
import { axios } from '@/lib/axios';
import {
  LoginAction,
  login as loginAction,
  logout as logoutAction,
  PersistedAuthentication,
  User,
} from '@/redux/reducers/authentication';
import { store } from '@/redux/store';

export async function login(data: PersistedAuthentication) {
  let userData: LoginAction = {
    user: data.user,
    accessToken: data.accessToken,
  };

  await AsyncStorage.setItem('authentication', userData);

  if (!data.user?.document_number || !data.user?.phone || !data.user?.address) {
    userData.intendedRoute = 'Account/Edit';
  }

  store.dispatch(loginAction(userData));
}

export async function logout() {
  await AsyncStorage.removeItem('authentication');

  store.dispatch(logoutAction());
}

export function logoutDialog() {
  Alert.alert(
    'Sair?',
    'Ao sair você precisará de uma conexão com a internet para entrar novamente, deseja realmente continuar?',
    [
      {
        text: 'Sair',
        onPress: () => logout(),
      },
      {
        text: 'Continuar aqui',
        onPress: () => {},
      },
    ],
  );
}

interface AuthenticationProviderProps {
  children: React.ReactElement;
}

export default function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  React.useEffect(() => {
    if (__DEV__) {
      login({
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document_number: '1234567890',
          phone: '(75) 99999-9999',
          address: 'Rua Teste, 123',
        },
        accessToken: '1234567890',
      });
      return;
    }

    AsyncStorage.getItem<PersistedAuthentication>('authentication').then(
      (authenticationData) => {
        if (authenticationData) {
          axios
            .get<User>(`/user`, {
              headers: {
                Authorization: `Bearer ${authenticationData.accessToken}`,
              },
              timeout: 10000,
            })
            .then(({ data }: any) => {
              login({
                user: data,
                accessToken: authenticationData.accessToken,
              });
            })
            .catch((error: any) => {
              if (error.response && error.response.status === 401) {
                logout();
              } else {
                login({
                  user: authenticationData.user,
                  accessToken: authenticationData.accessToken,
                });
              }
            });
        } else {
          logout();
        }
      },
    );
  }, []);

  return children;
}
