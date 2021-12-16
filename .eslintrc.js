module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'no-underscore-dangle': ['error', {allow: ['_id']}],
    'class-methods-use-this': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    quotes: [2, 'single', {avoidEscape: true, allowTemplateLiterals: true}],
    'prettier/prettier': [
      'error',
      {singleQuote: true, parser: 'flow', semi: true, trailingComma: 'none', endOfLine: 'auto'}
    ],
    camelcase: 'off',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off'
  },
  ignorePatterns: ['tests/*']
};
