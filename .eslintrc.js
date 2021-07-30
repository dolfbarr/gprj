module.exports = {
  extends: [
    'oclif',
    'oclif-typescript'
  ],
  plugins: ['simple-import-sort', 'sort-keys-fix'],
  rules: {
    'simple-import-sort/imports': ['error'],
    'sort-keys-fix/sort-keys-fix': ['error', 'asc', {caseSensitive: false, natural: true}],
    'sort-vars': ['error', {ignoreCase: true}]
  }
}
