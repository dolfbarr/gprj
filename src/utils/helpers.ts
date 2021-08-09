/* istanbul ignore file */

import {trimEnd} from 'lodash'
import {sep} from 'path'

import {Repo} from './database'
import {Entities, messages} from './messages'

export const INDEX_MARK = '@'

export const getBaseName = (dirPath: string) => dirPath.split(sep).pop() || dirPath
export const trimArray = (arr: string[]): string[] => arr.map(l => trimEnd(l)).filter(l => l)

export const findRepositories = (marks: string[], repositories: Repo[]): [Repo, number][] =>
  marks.map((mark: string): [Repo, number] => {
    const foundRepoIndex = mark.startsWith(INDEX_MARK) ?
      Number(mark.slice(1)) - 1 :
      repositories.findIndex(r => r.path === mark || getBaseName(r.path) === mark)

    const foundRepo = repositories?.[foundRepoIndex]

    if (!foundRepo) {
      throw new Error(messages.errors.notExist(Entities.Repo) + ': ' + mark)
    }

    return [foundRepo, foundRepoIndex + 1]
  })

export interface Statuses {
  status: {ahead: number; behind: number};
  stash: number;
  files: Array<{
    path: string;
  }>;
}

export enum RepoStatus {
  Ahead='ahead',
  Behind='behind',
  Diverged='diverged',
  None='none'
}

export const getRepoStatus = ({ahead, behind}: Statuses['status']): RepoStatus => {
  if (ahead && behind) return RepoStatus.Diverged
  if (ahead && !behind) return  RepoStatus.Ahead
  if (!ahead && behind) return  RepoStatus.Behind

  return  RepoStatus.None
}
