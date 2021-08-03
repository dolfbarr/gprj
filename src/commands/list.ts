import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import simpleGit from 'simple-git'

import {getDB, Repo} from '../utils/database'
import {status} from '../utils/git'
import {getBaseName, getRepoStatus, RepoStatus} from '../utils/helpers'
import {EntitiesPlural, messages} from '../utils/messages'
import {getModified, getStatuses, Icons, list, Logger} from '../utils/renderer'

export interface TotalStatus {
  ahead: number;
  behind: number;
  diverged: number;
}

export const repoLine = async (r: Repo, totalStatus: TotalStatus) => {
  const git = await simpleGit(r.path)
  const currentStatus = (await status(git))
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

  const modified = getModified(currentStatus.files.map(file => ({
    path: file.path,
  })))

  return `${getStatuses(gitStatus)} ${getBaseName(r.path)}${modified} ${chalk.cyan(`(${currentStatus.current})`)}`
}

export const getReposLines = async (repos: Repo[]): Promise<[string[], TotalStatus]> => {
  const totalStatus: TotalStatus = {ahead: 0, behind: 0, diverged: 0}

  return new Promise(resolve => (Promise.all(repos.map(r => repoLine(r, totalStatus))).then(lines => resolve([lines, totalStatus]))))
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
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(List)
    const {info, fav, empty, lineAll, heading} = new Logger(this.log)

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

      if (totalStatus.ahead || totalStatus.behind || totalStatus.diverged) {
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
        }]))
      }
    }
  }
}
