/* istanbul ignore file */
import {trimEnd} from 'lodash'
import {sep} from 'path'

export const getBaseName = (dirPath: string) => dirPath.split(sep).pop() || dirPath
export const trimArray = (arr: string[]): string[] => arr.map(l => trimEnd(l)).filter(l => l)
