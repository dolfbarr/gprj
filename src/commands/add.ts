import {Command, flags} from '@oclif/command'
import {resolve} from 'path'
import {getDB, Repo} from '../utils/database'
import {Logger} from '../utils/renderer'
import fs from 'fs'
import {isTest} from '../utils/helpers'
import {Entities, messages} from '../utils/messages'

export const NO_DIR_ERROR = 'directory does not exist'
export const PATH_DIR_ERROR = 'path should be a directory'
export const REPO_EXIST_ERROR = 'repository already exists'
export const REPO_SUCCESS = 'Repository has been added'

export default class Add extends Command {
  static description = messages.descriptions.add()

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
    /* istanbul ignore next */
    if (!isTest() && !fs.existsSync(repoPath)) {
      throw new Error(messages.errors.dirNotExist())
    }
    /* istanbul ignore next */
    if (!isTest() && !fs.lstatSync(repoPath).isDirectory()) {
      throw new Error(messages.errors.pathNotDir())
    }

    const db = await getDB(this.config.dataDir)
    if (db.get('repositories').find({path: repoPath}).value()) {
      throw new Error(messages.errors.alreadyExist(Entities.Repo))
    }

    db.get('repositories').push({
      path: resolve(process.cwd(), args.path),
    } as Repo).write()
    done(messages.done.add(Entities.Repo))
  }

  async catch(error: any) {
    const {fail} = new Logger(this.log)

    fail(error.message)

    /* istanbul ignore next */
    !isTest() && this.exit(1)
  }
}
