/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
const path = require('path')

process.env.TS_NODE_PROJECT = path.resolve('./tsconfig.json')
process.env.NODE_ENV = 'development'

global.oclif = global.oclif || {}
global.oclif.columns = 80

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
}
