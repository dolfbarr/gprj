import {Command, flags} from '@oclif/command'
import {getDB} from '../utils/database'
import {getBaseName} from '../utils/helpers'
import {EntitiesPlural, messages} from '../utils/messages'
import {Logger} from '../utils/renderer'

export default class List extends Command {
  static description = messages.descriptions.list()

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
      lineAll(repos.map(r => getBaseName(r.path)))
    }
  }
}
