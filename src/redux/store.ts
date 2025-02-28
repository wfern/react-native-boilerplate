import { useDispatch, useSelector } from 'react-redux';
import { configureStore, Middleware } from '@reduxjs/toolkit';

// import * as Sentry from '@sentry/react-native';

// import { createLogger } from 'redux-logger';

import authentication from './reducers/authentication';

// const loggerMiddleware = createLogger({
//   collapsed: true,
// });

// const sentryReduxEnhancer = Sentry.createReduxEnhancer({
//   stateTransformer() {
//     return null;
//   },
// });

let middleware: Middleware[] = [];

export const store = configureStore({
  reducer: {
    authentication,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: true,
      serializableCheck: true,
    }).concat(middleware),
  // enhancers: [sentryReduxEnhancer],
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<RootState>();

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
