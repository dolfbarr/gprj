import {Command, flags} from '@oclif/command'
import {getDB, Repo} from '../utils/database'
import {getBaseName} from '../utils/helpers'
import {EntitiesPlural, messages} from '../utils/messages'
import {Logger} from '../utils/renderer'
import simpleGit from 'simple-git'
import {branch} from '../utils/git'
import chalk from 'chalk'

export const repoLine = async (r: Repo) => {
  const git = await simpleGit(r.path)
  const currentBranch = (await branch(git)).current
  return getBaseName(r.path) + ` ${chalk.cyan(`(${currentBranch})`)}`
}

export default class List extends Command {
  static description = messages.descriptions.list()

  static examples = [
    `$ gprj add /path/to/repo
       ✔ done  Repository has been successfully added`,
  ]

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
