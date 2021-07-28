import {Command, flags} from '@oclif/command'
import {resolve} from 'path'
import {getDB, Repo} from '../utils/database'
import {Logger} from '../utils/renderer'
import fs from 'fs'
import {isTest} from '../utils/helpers'

export const NO_PATH_ERROR = 'path is not provided'
export const NO_DIR_ERROR = 'directory does not exist'
export const PATH_DIR_ERROR = 'path should be a directory'
export const REPO_EXIST_ERROR = 'repository already exists'
export const REPO_SUCCESS = 'Repository has been added'

export default class Add extends Command {
  static description = 'adds repository to local database'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'path'}]

  async run() {
    const {args} = this.parse(Add)
    const {done} = new Logger(this.log)

    if (!args.path) {
      throw new Error(NO_PATH_ERROR)
    }

    const repoPath = resolve(process.cwd(), args.path)
    /* istanbul ignore next */
    if (!isTest() && !fs.existsSync(repoPath)) {
      throw new Error(NO_DIR_ERROR)
    }
    /* istanbul ignore next */
    if (!isTest() && !fs.lstatSync(repoPath).isDirectory()) {
      throw new Error(PATH_DIR_ERROR)
    }

    const db = await getDB(this.config.dataDir)
    if (db.get('repositories').find({path: repoPath}).value()) {
      throw new Error(REPO_EXIST_ERROR)
    }

    db.get('repositories').push({
      path: resolve(process.cwd(), args.path),
    } as Repo).write()
    done(REPO_SUCCESS)
  }

  async catch(error: any) {
    const {fail} = new Logger(this.log)

    fail(error)

    /* istanbul ignore next */
    !isTest() && this.exit(1)
  }
}
