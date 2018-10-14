module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': 'off',
    'prefer-template': 'off',
    'no-useless-escape': 'off',
    'max-len': 'off',
    'new-cap': 'off',
    'no-undef': 'off',
    'no-new': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
