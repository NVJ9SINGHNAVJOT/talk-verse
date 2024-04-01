// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist', 'build', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    "semi": "error",
  },
};
