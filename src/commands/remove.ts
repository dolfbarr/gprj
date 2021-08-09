import {Command, flags} from '@oclif/command'

import {getDB, Repo} from '../utils/database'
import {findRepositories, INDEX_MARK} from '../utils/helpers'
import {Entities, EntitiesPlural, messages} from '../utils/messages'
import {Logger} from '../utils/renderer'

export default class Remove extends Command {
  static description = messages.descriptions.remove()

  static examples = [
    `$ gprj remove /path/to/repo ${INDEX_MARK}2 repo
       ✔ done  All repositories have been successfully removed`,
  ]

  static aliases = ['rm']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static strict = false

  async run() {
    const {argv} = this.parse(Remove)
    const {done} = new Logger(this.log)

    if (argv.length === 0) {
      throw new Error(messages.errors.notProvided(Entities.Repo))
    }

    const db = await getDB(this.config.dataDir)
    const currentRepos = db.get('repositories')

    findRepositories(argv, currentRepos.value()).forEach(([repo]: [Repo, number]) => currentRepos.remove({path: repo.path}).write())
    done(argv.length > 1 ? messages.done.removePlural(EntitiesPlural.Repos) :  messages.done.remove(Entities.Repo))
  }

  async catch(error: any) {
    const {fail} = new Logger(this.log)

    fail(error.message)
    this.exit(1)
  }
}
