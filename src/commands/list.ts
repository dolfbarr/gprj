import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import simpleGit from 'simple-git'

import {getDB, Repo} from '../utils/database'
import {status} from '../utils/git'
import {getBaseName} from '../utils/helpers'
import {EntitiesPlural, messages} from '../utils/messages'
import {getStatuses, Logger, SPACE} from '../utils/renderer'

export const repoLine = async (r: Repo) => {
  const git = await simpleGit(r.path)
  const currentStatus = (await status(git))
  return getStatuses({status: {ahead: currentStatus.ahead, behind: currentStatus.behind}}) + SPACE + getBaseName(r.path) + ` ${chalk.cyan(`(${currentStatus.current})`)}`
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
    const {info, fav, empty, lineAll, heading} = new Logger(this.log)

    const db = await getDB(this.config.dataDir)
    const repos = db.get('repositories').value()

    if (repos.length === 0) {
      info(messages.info.empty(EntitiesPlural.Repos))
      empty()
      fav(messages.info.addCommand())

      this.exit(0)
    } else {
      empty()
      heading(messages.info.all(EntitiesPlural.Repos))
      empty()
      Promise.all(repos.map(r => repoLine(r))).then(lines => lineAll(lines))
    }
  }
}
