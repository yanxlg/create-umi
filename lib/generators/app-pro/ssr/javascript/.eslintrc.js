module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    page: true,
  },
  rules: {
    'react/jsx-curly-brace-presence': 0,
    'max-len': [0, 1000, 4],
    'spaced-comment': 0,
    ' no-console': 0,
    'import/order': 0,
    'lines-between-class-members': 0,
    'prefer-arrow-callback': 0,
    'react/sort-comp': 0,
    'react/no-find-dom-node': 0,
    radix: 0,
    'no-unused-expressions': 0,
    'object-shorthand': 0,
    'arrow-body-style': 0,
    'import/no-extraneous-dependencies': 0,
    'class-methods-use-this': 0,
    'no-plusplus': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'no-void': 0,
    '@typescript-eslint/camelcase': 0,
    'no-nested-ternary': 0,
    'no-confusing-arrow': 0,
    'prefer-promise-reject-errors': 0,
    'no-case-declarations': 0,
  },
};
