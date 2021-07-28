/* istanbul ignore file */
import {sep} from 'path'
import {trimEnd} from 'lodash'

export const getBaseName = (dirPath: string) => dirPath.split(sep).pop() || dirPath
export const trimArray = (arr: string[]): string[] => arr.map(l => trimEnd(l)).filter(l => l)
