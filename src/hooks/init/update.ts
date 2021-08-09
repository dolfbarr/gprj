import {Hook} from '@oclif/config'
import updateNotifier from 'update-notifier'

import {Alerts} from '../../utils/messages'
import {Logger, update} from '../../utils/renderer'

export const notify: Hook<'init'> = async function () {
  const {fav} = new Logger(this.log)
  const notifier = updateNotifier({pkg: {name: this.config.name, version: this.config.version}})

  if (notifier.update) {
    const {current, latest} = notifier.update
    fav(update({version: {current, latest}}), Alerts.Update)
  }
}
