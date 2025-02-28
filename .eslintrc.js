// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    'expo',
    'plugin:prettier/recommended',
    'plugin:@tanstack/query/recommended',
  ],
  plugins: ['react-refresh', 'eslint-plugin-react-compiler'],
  ignorePatterns: ['/dist/*', '.expo/*', 'android/*', 'ios/*'],
  rules: {
    '@typescript-eslint/no-empty-object-type': 'off',
    'react/destructuring-assignment': ['error', 'always'],
    'react-refresh/only-export-components': 'error',
    'react-compiler/react-compiler': 'error',
  },
};
