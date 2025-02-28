import 'ts-node/register';

import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Boilerplate App',
  slug: 'boilerplate-app',
  scheme: 'boilerplate-app',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',

  icon: './assets/images/icon.png',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#F5F5F7',
  },

  newArchEnabled: false,
  experiments: {
    reactCompiler: true,
  },
  ios: {
    bundleIdentifier: 'com.boilerplate.app',
  },
  android: {
    package: 'com.boilerplate.app',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#F5F5F7',
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    eas: {
      projectId: '',
    },
  },
  plugins: [
    // [
    //   'expo-build-properties',
    //   {
    //     android: {
    //       extraMavenRepos: [
    //         {
    //           url: 'https://github.com/pagseguro/PlugPagServiceWrapper/raw/master',
    //         },
    //       ],
    //     },
    //   },
    // ],
    ['expo-asset', {}],
    // [
    //   'expo-splash-screen',
    //   {
    //     backgroundColor: '#ffffff',
    //     image: './assets/images/logo-1024.png',
    //     dark: {
    //       backgroundColor: '#000000',
    //       image: './assets/images/logo-1024.png',
    //     },
    //   },
    // ],
    // [
    //   'expo-font',
    //   {
    //     fonts: [
    //       'assets/fonts/RobotoMono/RobotoMono-Thin.ttf',
    //       'assets/fonts/RobotoMono/RobotoMono-Light.ttf',
    //       'assets/fonts/RobotoMono/RobotoMono-Regular.ttf',
    //       'assets/fonts/RobotoMono/RobotoMono-SemiBold.ttf',
    //       'assets/fonts/RobotoMono/RobotoMono-Bold.ttf',
    //     ],
    //   },
    // ],
    [
      'react-native-bootsplash',
      {
        assetsDir: './assets/bootsplash',
      },
    ],
    // [
    //   '@sentry/react-native/expo',
    //   {
    //     url: 'https://sentry.io/',
    //     note: 'Use SENTRY_AUTH_TOKEN env to authenticate with Sentry.',
    //     project: '',
    //     organization: '',
    //   },
    // ],
    //
  ],
};

export default config;
