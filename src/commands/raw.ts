import {Command, Flags} from '@oclif/core'
import execa from 'execa'
import Listr from 'listr'

import {getDB, Repo} from '../utils/database'
import {findRepositories, getBaseName} from '../utils/helpers'
import {Entities,  EntitiesPlural,  messages} from '../utils/messages'
import {Logger, SPACE} from '../utils/renderer'

export const DEFAULT_TIMEOUT = 5000

export default class Raw extends Command {
  static description = messages.descriptions.raw()

  static examples = [
    `$ gprj raw  /path/to/repo1 /path/to/repo2 --execute='yarn test' --timeout=2000

 ✔ repo1
 ✔ repo2

 ✔ done  All commands has been successfully executed`,
  ]

  static aliases = ['r']

  static flags = {
    execute: Flags.string({char: 'x', description: messages.descriptions.execute(), required: true}),
    help: Flags.help({char: 'h'}),
    timeout: Flags.integer({char: 't', default: DEFAULT_TIMEOUT, description: messages.descriptions.timeout()}),
  }

  static strict = false

  async run() {
    const {argv, flags} = await this.parse(Raw)
    const {done, empty} = new Logger(this.log.bind(this))

    if (argv.length === 0) {
      throw new Error(messages.errors.notProvided(Entities.Repo))
    }

    const [command, ...commandArgs] = flags.execute.split(SPACE)

    const db = await getDB(this.config.dataDir)
    const currentRepos = db.get('repositories')

    empty()

    const tasks =
      new Listr(
        findRepositories(argv, currentRepos.value())
        .map(([repo]: [Repo, number]) => ({
          task: async () =>  {
            const subprocess =  execa(command, commandArgs, {cwd: repo.path, timeout: flags.timeout})

            try {
              return await subprocess
            } catch (error) {
              return Promise.reject(new Error(messages.errors.timeout()))
            }
          },
          title: getBaseName(repo.path),
        })), {concurrent: true, exitOnError: false})

    await tasks.run().catch(error => {
      throw new Error(error.message)
    })

    empty()
    done(argv.length > 1 ? messages.done.executePlural(EntitiesPlural.Commands) :  messages.done.execute(Entities.Command))
  }

  async catch(error: any) {
    const {fail, empty} = new Logger(this.log.bind(this))

    empty()
    fail(error.message)
    this.exit(1)
  }
}
