/* istanbul ignore file */
import {trimEnd} from 'lodash'
import mockFS from 'mock-fs'
import {sep} from 'path'
import path from 'path'

export const getBaseName = (dirPath: string) => dirPath.split(sep).pop() || dirPath
export const trimArray = (arr: string[]): string[] => arr.map(l => trimEnd(l)).filter(l => l)

export const mockDirs = (dirs = {}) => {
  mockFS({
    node_modules: mockFS.load(path.resolve(__dirname, '../../node_modules')),
    'package.json': mockFS.load(path.resolve(__dirname, '../../package.json')),
    src: mockFS.load(path.resolve(__dirname, '../../src')),
    'tsconfig.json': mockFS.load(path.resolve(__dirname, '../../tsconfig.json')),
    ...dirs,
  }, {createCwd: false})
}
