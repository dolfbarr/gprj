import {Command, Flags} from '@oclif/core'
import chalk from 'chalk'
import fs from 'fs'
import simpleGit from 'simple-git'

import {getDB, Repo} from '../utils/database'
import {stashList, status} from '../utils/git'
import {getBaseName, getRepoStatus, RepoStatus, Statuses} from '../utils/helpers'
import {EntitiesPlural, messages} from '../utils/messages'
import {getModified, getStatuses, Icons, list, Logger, NIL} from '../utils/renderer'

export interface TotalStatus {
  ahead: number;
  behind: number;
  diverged: number;
  stashed: number;
  modified: number;
  conflicted: number;
}

export const renderRepoLine = ({stash, status, path, modified, currentStatus}: {path: string, modified: string, currentStatus: string | null} & Pick<Statuses, 'status' | 'stash'>) => {
  return `${getStatuses({stash, status})} ${getBaseName(path)}${modified} ${currentStatus && chalk.magenta(`(${currentStatus})`)}`
}

export const repoLine = async (r: Repo, totalStatus: TotalStatus) => {
  if (!fs.existsSync(r.path)) {
    return `${chalk.red(renderRepoLine({currentStatus: NIL, modified: NIL, path: r.path, stash: 0, status: {ahead: 0, behind: 0}}))}`
  }

  const git = await simpleGit(r.path)
  const currentStatus = (await status(git))
  const currentStashList = (await stashList(git))
  const gitStatus = {ahead: currentStatus.ahead, behind: currentStatus.behind}

  switch (getRepoStatus(gitStatus)) {
  case RepoStatus.Ahead:
    totalStatus.ahead++
    break
  case RepoStatus.Behind:
    totalStatus.behind++
    break
  case RepoStatus.Diverged:
    totalStatus.diverged++
    break
  default:
    break
  }

  if (currentStashList.total > 0) totalStatus.stashed++
  if (currentStatus.files.length > 0) totalStatus.modified++
  if (currentStatus.conflicted.length > 0) {
    totalStatus.modified--
    totalStatus.conflicted++
  }

  const modified = getModified(currentStatus.files.length, currentStatus.conflicted.length)

  return renderRepoLine({currentStatus: currentStatus.current, modified, path: r.path, stash: currentStashList.total, status: gitStatus})
}

export const getReposLines = async (repos: Repo[]): Promise<[string[], TotalStatus]> => {
  const totalStatus: TotalStatus = {ahead: 0, behind: 0, conflicted: 0, diverged: 0, modified: 0, stashed: 0}

  return new Promise(resolve => (Promise.all(repos.map(r => repoLine(r, totalStatus))).then(lines => resolve([lines, totalStatus])))) // eslint-disable-line no-promise-executor-return
}

export default class List extends Command {
  static description = messages.descriptions.list()

  static examples = [
    `$ gprj list

All repositories:

 1. gprj (main)`,
  ]

  static aliases = ['ls']

  static flags = {
    help: Flags.help({char: 'h'}),
  }

  async run() {
    await this.parse(List)
    const {info, fav, empty, lineAll, heading} = new Logger(this.log.bind(this))

    const db = await getDB(this.config.dataDir)
    const repos = db.get('repositories').value()

    if (repos.length === 0) {
      info(messages.info.empty(EntitiesPlural.Repos))
      empty()
      fav(messages.info.addCommand())

      this.exit(0)
    } else {
      const [lines, totalStatus] = await getReposLines(repos)

      empty()
      heading(messages.info.all(EntitiesPlural.Repos))
      empty()
      lineAll(lines)
      empty()

      if (Object.values(totalStatus).some(status => status > 0)) {
        info(list([{
          icon: Icons.Ahead,
          label: '(ahead)',
          value: totalStatus.ahead,
        }, {
          icon: Icons.Behind,
          label: '(behind)',
          value: totalStatus.behind,
        }, {
          icon: Icons.Diverged,
          label: '(diverged)',
          value: totalStatus.diverged,
        }, {
          icon: Icons.Stash,
          label: '(stashed)',
          value: totalStatus.stashed,
        }, {
          icon: Icons.Modified,
          label: '(modified)',
          value: totalStatus.modified,
        },  {
          icon: Icons.Conflicted,
          label: '(conflicted)',
          value: totalStatus.conflicted,
        }]))
      }
    }
  }
}
