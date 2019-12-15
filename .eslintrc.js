module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base'
    // 'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'semi': ['error', 'never'],
    "@typescript-eslint/member-delimiter-style": ["error", {
      multiline: {
        delimiter: 'none',
        requireLast: true,
      },
      singleline: {
        delimiter: 'none',
        requireLast: false,
      },
    }]
  },
};
