// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    "plugin:drizzle/recommended",
  ],
  ignorePatterns: ['dist', 'build', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'drizzle'],
  rules: {
    "semi": "warn",
    "no-unused-vars": "warn",
    'drizzle/enforce-delete-with-where': "error",
    'drizzle/enforce-update-with-where': "error",
  },
};
