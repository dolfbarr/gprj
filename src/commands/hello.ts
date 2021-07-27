import {Command, flags} from '@oclif/command'
import {Logger} from '../utils/renderer'

export default class Hello extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ gprj hello
hello world from ./src/hello.ts!
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Hello)
    const {info, done} = new Logger(this.log)

    const name = flags.name ?? 'world'
    info(`hello ${name} from ./src/commands/hello.ts`)
    if (args.file && flags.force) {
      done(`you input --force and --file: ${args.file}`)
    }
  }
}
