/* istanbul ignore file */
import {trimEnd} from 'lodash'
import {sep} from 'path'

import {Repo} from './database'
import {Entities, messages} from './messages'

export const INDEX_MARK = '@'

export const getBaseName = (dirPath: string) => dirPath.split(sep).pop() || dirPath
export const trimArray = (arr: string[]): string[] => arr.map(l => trimEnd(l)).filter(l => l)

export const findRepositories = (marks: string[], repositories: Repo[]): Repo[] =>
  marks.map((mark: string): Repo => {
    const foundRepo = mark.startsWith(INDEX_MARK) ?
      repositories[Number(mark.slice(1)) - 1] :
      repositories.find(r => r.path === mark || getBaseName(r.path) === mark)

    if (!foundRepo) {
      throw new Error(messages.errors.notExist(Entities.Repo) + ': ' + mark)
    }

    return foundRepo
  })
