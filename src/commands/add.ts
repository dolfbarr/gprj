import {Command, Flags} from '@oclif/core'
import fs from 'fs'
import path from 'path'
import simpleGit from 'simple-git'

import {getDB} from '../utils/database'
import {checkIsRepo} from '../utils/git'
import {Entities, EntitiesPlural, messages} from '../utils/messages'
import {Logger} from '../utils/renderer'

export const NO_DIR_ERROR = 'directory does not exist'
export const PATH_DIR_ERROR = 'path should be a directory'
export const REPO_EXIST_ERROR = 'repository already exists'
export const REPO_SUCCESS = 'Repository has been added'

export default class Add extends Command {
  static description = messages.descriptions.add()

  static examples = [
    `$ gprj add /path/to/repo
 ✔ done  Repository has been successfully added`,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
  }

  static strict = false

  async run() {
    const {argv} = await this.parse(Add)
    const {done} = new Logger(this.log.bind(this))

    if (argv.length === 0) {
      throw new Error(messages.errors.notProvided(Entities.Path))
    }

    await Promise.all(argv.map(async (argPath: string) => {
      const repoPath = path.resolve(process.cwd(), argPath)
      if (!fs.existsSync(repoPath)) {
        throw new Error(messages.errors.dirNotExist())
      }

      if (!fs.lstatSync(repoPath).isDirectory()) {
        throw new Error(messages.errors.pathNotDir())
      }

      const db = await getDB(this.config.dataDir)
      if (db.get('repositories').value().some(r => r.path === repoPath)) {
        throw new Error(messages.errors.alreadyExist(Entities.Repo))
      }

      const git = await simpleGit(repoPath)
      if (!(await checkIsRepo(git))) {
        throw new Error(messages.errors.notGitRepo())
      }

      db.get('repositories').push({
        dateAdded: Date.now(),
        path: repoPath,
      }).write()
    }))

    done(argv.length > 1 ? messages.done.addPlural(EntitiesPlural.Repos) :  messages.done.add(Entities.Repo))
  }

  async catch(error: any) {
    const {fail} = new Logger(this.log.bind(this))

    fail(error.message)
    this.exit(1)
  }
}
