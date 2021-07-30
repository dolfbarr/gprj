import {Command, flags} from '@oclif/command'
import fs from 'fs'
import {resolve} from 'path'
import simpleGit from 'simple-git'

import {getDB} from '../utils/database'
import {checkIsRepo} from '../utils/git'
import {Entities, messages} from '../utils/messages'
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
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'path'}]

  async run() {
    const {args} = this.parse(Add)
    const {done} = new Logger(this.log)

    if (!args.path) {
      throw new Error(messages.errors.pathNotProvided())
    }

    const repoPath = resolve(process.cwd(), args.path)
    if (!fs.existsSync(repoPath)) {
      throw new Error(messages.errors.dirNotExist())
    }

    if (!fs.lstatSync(repoPath).isDirectory()) {
      throw new Error(messages.errors.pathNotDir())
    }

    const db = await getDB(this.config.dataDir)
    if (db.get('repositories').value().find(r => r.path === repoPath)) {
      throw new Error(messages.errors.alreadyExist(Entities.Repo))
    }
    const git = await simpleGit(repoPath)
    if (!(await checkIsRepo(git))) {
      throw new Error(messages.errors.notGitRepo())
    }

    db.get('repositories').push({
      dateAdded: Date.now(),
      path: resolve(process.cwd(), args.path),
    }).write()
    done(messages.done.add(Entities.Repo))
  }

  async catch(error: any) {
    const {fail} = new Logger(this.log)

    fail(error.message)
    this.exit(1)
  }
}
