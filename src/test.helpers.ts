/* istanbul ignore file */

import {ExitError} from '@oclif/core/lib/errors'
import mockFS from 'mock-fs'
import path from 'path'

export const mockDirs = (dirs = {}) => {
  mockFS({
    node_modules: mockFS.load(path.resolve(__dirname, '../node_modules')), // eslint-disable-line camelcase
    'package.json': mockFS.load(path.resolve(__dirname, '../package.json')),
    src: mockFS.load(path.resolve(__dirname, '../src')),
    'tsconfig.json': mockFS.load(path.resolve(__dirname, '../tsconfig.json')),
    ...dirs,
  }, {createCwd: false})
}

export const handleExitError = (err: unknown) => {
  if (err instanceof ExitError) {
    expect(err.oclif.exit).toBe(1)
  }
}
