module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      ['babel-plugin-react-compiler', { target: '18' }],
      'react-native-reanimated/plugin',
    ],
  };
};
