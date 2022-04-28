module.exports = {
  extends: [
    'oclif',
    'oclif-typescript',
  ],
  plugins: ['simple-import-sort', 'sort-keys-fix'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'node/no-missing-import': 1,
    'simple-import-sort/imports': ['error'],
    'sort-keys-fix/sort-keys-fix': ['error', 'asc', {caseSensitive: false, natural: true}],
    'sort-vars': ['error', {ignoreCase: true}],
    'unicorn/no-array-for-each': 0,
    'unicorn/prefer-module': 0,
    'unicorn/prefer-node-protocol': 0,
  },
}
