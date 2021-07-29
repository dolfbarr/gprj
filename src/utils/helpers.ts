/* istanbul ignore file */
import {sep} from 'path'
import {trimEnd} from 'lodash'
import mockFS from 'mock-fs'
import path from 'path'

export const getBaseName = (dirPath: string) => dirPath.split(sep).pop() || dirPath
export const trimArray = (arr: string[]): string[] => arr.map(l => trimEnd(l)).filter(l => l)

export const mockDirs = (dirs = {}) => {
  mockFS({
    'package.json': mockFS.load(path.resolve(__dirname, '../../package.json')),
    'tsconfig.json': mockFS.load(path.resolve(__dirname, '../../tsconfig.json')),
    src: mockFS.load(path.resolve(__dirname, '../../src')),
    node_modules: mockFS.load(path.resolve(__dirname, '../../node_modules')),
    ...dirs,
  }, {createCwd: false})
}
