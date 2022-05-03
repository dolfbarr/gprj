import {Command, Flags} from '@oclif/core'
import fs from 'fs'
import path from 'path'
import simpleGit from 'simple-git'

import {getDB, Repo} from '../utils/database'
import {checkIsRepo} from '../utils/git'
import {getBaseName} from '../utils/helpers'
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
 ✔ done  Repository repo has been successfully added`,
  ]

  static flags = {
    help: Flags.help({char: 'h'}),
  }

  static strict = false

  async run() {
    const {argv} = await this.parse(Add)
    const {done,  fail} = new Logger(this.log.bind(this))

    if (argv.length === 0) {
      throw new Error(messages.errors.notProvided(Entities.Path))
    }

    const patterns  = argv
    const db = await getDB(this.config.dataDir)

    const addRepo =  async (pattern: string): Promise<Repo> => {
      const repoPath = path.resolve(process.cwd(), pattern)
      const repoName = getBaseName(repoPath)

      if (!fs.existsSync(repoPath)) {
        return Promise.reject(messages.errors.dirNotExist() + ': ' + repoPath)
      }

      if (!fs.lstatSync(repoPath).isDirectory()) {
        return Promise.reject(messages.errors.pathNotDir() + ': ' + repoPath)
      }

      if (db.get('repositories').value().some(r => r.path === repoPath)) {
        return Promise.reject(messages.errors.alreadyExist(Entities.Repo) + ': ' + repoName)
      }

      const git = await simpleGit(repoPath)
      if (!(await checkIsRepo(git))) {
        return Promise.reject(messages.errors.notGitRepo() + ': ' + repoName)
      }

      return new Promise(resolve => {
        done(messages.done.add(Entities.Repo) + ': ' + repoName)
        resolve({
          dateAdded: Date.now(),
          path: repoPath,
        } as Repo)
      })
    }

    Promise.all(patterns.map((pattern): Promise<Repo> =>
      addRepo(pattern)
      .catch(error => {
        fail(error)
        return error
      })))
    .then(newRepos =>
      db.get('repositories').push(...newRepos).write())
  }

  async catch(error: any) {
    const {fail, empty} = new Logger(this.log.bind(this))

    empty()
    fail(error.message)
    this.exit(1)
  }
}
