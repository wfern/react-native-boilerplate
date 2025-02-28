/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  // @ianvs/prettier-plugin-sort-imports
  importOrder: [
    '<BUILT_IN_MODULES>',
    '',
    '^react',
    '^react-native',
    '^expo',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/assets',
    '^@/constants',
    '^@/lib',
    '^@/modules',
    '^@/redux',
    '^@/hooks',
    '^@/components',
    '^@/navigation',
    '^@/screens',
    '^@/utils',
    '',
    '^(?!.*[.]css$)[./].*$',
    '',
    '.css$',
  ],
  // prettier-plugin-tailwindcss
  tailwindAttributes: ['class', 'className', 'classNames'],
  tailwindFunctions: ['clsx', 'cva', 'tv'],
  //
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
};

module.exports = config;
