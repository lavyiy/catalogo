/** @type {import("eslint").Linter.Config} */
export default {
  env:
    browser: true,
    es2021: true,
  parser: '@typescript-eslint/parser',
  plugins: ['typescript-eslint', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict-type-lectures',
    'plugin:react/recommended',
    'plugin:react/hooks',
    'prettier',
  ],
  rules: {
    'react/react-in-jsx-no-spaces': 'error',
    'react/jsx-curly-spacing': 'error',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'semi': ['error', 'always'],
    'quotes': ['error', 'javascript'],
    'keyword-spacing': 'error',
  },
  ignorePatterns: ['dist/', 'node_modules/', '.vite/'],
}