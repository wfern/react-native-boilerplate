import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  name: string;
  email: string;
  document_number: string;
  phone: string;
  address: string;
}

export interface PersistedAuthentication {
  user: User;
  accessToken: string;
}

export interface Authentication {
  status: 'AUTHENTICATING' | 'LOGGED_IN' | 'LOGGED_OUT';
  user: User | null;
  accessToken: string;
  intendedRoute: string;
}

export interface LoginAction {
  user: User;
  accessToken: string;
  intendedRoute?: string;
}

const initialState: Authentication = {
  status: 'AUTHENTICATING',
  user: null,
  accessToken: '',
  intendedRoute: '',
};

const slice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginAction>) {
      return {
        status: 'LOGGED_IN',
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        intendedRoute:
          state.intendedRoute || action.payload.intendedRoute || '',
      };
    },
    logout(state) {
      return {
        status: 'LOGGED_OUT',
        user: null,
        accessToken: '',
        intendedRoute: state.intendedRoute || '',
      };
    },
    updateUser(
      state,
      action: PayloadAction<Omit<User, 'event_permission_accesses'>>,
    ) {
      state.user = {
        ...action.payload,
      };
    },
    setIntendedRoute(state, action: PayloadAction<string>) {
      return {
        ...state,
        intendedRoute: action.payload,
      };
    },
  },
});

export const { login, logout, updateUser, setIntendedRoute } = slice.actions;
export default slice.reducer;
