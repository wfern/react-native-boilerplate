// const { getDefaultConfig } = require("expo/metro-config");
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = getSentryExpoConfig(__dirname);

module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, { input: './global.css', inlineRem: false }),
);
