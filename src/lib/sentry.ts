import * as SentryMethods from '@sentry/react-native';

export function initializeSentry() {
  SentryMethods.init({
    dsn: '',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // We recommend adjusting this value in production
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 1.0,
  });
}

export const Sentry = { ...SentryMethods, init: initializeSentry };
